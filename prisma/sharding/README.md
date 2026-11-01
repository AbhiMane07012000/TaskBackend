# Three-shard rollout plan for TaskBackend

## Important: staged foundation, not an enabled production cutover

The current application has a single DATABASE_URL and its controllers import
config/db.js directly. Its current Prisma schema has no Organization model.
The files in this directory establish the control-plane schema and shard
connection/routing primitives. They do NOT switch existing endpoints to shards.
Do not set production traffic to these shards until the migration and controller
conversion steps below are complete.

## Target topology

- Control database: organization directory and user-to-organization lookup.
- shard1, shard2, shard3: tenant-owned application records.
- Shard assignment is read from OrganizationDirectory. Do not calculate
  shardId from a modulo hash at request time: a persisted mapping allows moving
  one organization without changing every tenant's route.

## Environment

Keep DATABASE_URL for the current single-database application during migration.
Add:

CONTROL_DATABASE_URL=postgresql://.../task_control
SHARD_1_DATABASE_URL=postgresql://.../task_shard_1
SHARD_2_DATABASE_URL=postgresql://.../task_shard_2
SHARD_3_DATABASE_URL=postgresql://.../task_shard_3
SHARD_POOL_MAX=10
CONTROL_POOL_MAX=5

Do not commit credentials. Use separate least-privilege database users in
production and TLS where required by your hosting provider.

## Step 1 - create databases

Create task_control, task_shard_1, task_shard_2 and task_shard_3. Apply the
existing Prisma schema/migrations to each shard so all three have identical
tables and enum definitions. Apply control-plane.sql only to task_control.

## Step 2 - introduce tenant ownership

Add Organization to the application Prisma schema. Add organizationId to
User, Project, Task, Comment, Notification, ProjectUser, TaskUser and
Subscription (where applicable). Add relations and indexes. Make tenant-scoped
unique constraints composite, for example:
  @@unique([organizationId, email])
  @@unique([organizationId, username])
  @@unique([organizationId, name])

Do not remove the existing global unique constraints until you have decided
whether email/username must be globally unique. If global login by email is
required, UserDirectory.email remains globally unique.

For relationships, enforce same-tenant ownership. A Task must not reference a
Project from another organization; a Comment must not reference a Task from
another organization; membership rows must reference users and projects from
the same organization. Prefer composite foreign keys/unique constraints where
possible, or validate within a transaction in the same shard.

## Step 3 - safe backfill of existing data

1. Take a tested backup and record row counts for every table.
2. Create one legacy organization in the control database and choose a shard
   (for a first migration, shard1 is simplest).
3. Add organizationId columns as NULLABLE to existing tables first.
4. Backfill all existing users/projects/tasks/comments/notifications and
   join tables with the legacy organization ID. Use parent joins for child
   records rather than assuming IDs encode ownership.
5. Backfill UserDirectory from the existing users table and insert the
   OrganizationDirectory row with shardId='shard1'.
6. Validate no tenant-owned row has a NULL organizationId and verify foreign
   key relationships and row counts.
7. Add NOT NULL constraints, tenant indexes, composite uniqueness and tenant
   foreign keys only after validation.
8. Deploy application code in maintenance/read-only mode, perform final delta
   sync, then switch reads/writes. Keep the old database read-only for rollback.

Do not run a blind INSERT ... SELECT into all three shards. Each organization
must be copied to exactly one assigned shard, preserving IDs and relationships.

## Step 4 - authentication and routing

Login must first resolve email in UserDirectory, obtain organizationId, then
resolve OrganizationDirectory.shardId. Verify credentials using the chosen
single source of truth and issue JWT claims containing userId and
organizationId. The current JWT code does not include organizationId, so
existing tokens must expire or be invalidated at cutover.

The shard middleware must run after JWT authentication. It resolves the
organization's shard from the control database and attaches req.db. Never
trust a shard name supplied by the browser.

## Step 5 - convert every database access

Replace controller/service imports of config/db.js with req.db for
request-scoped operations, or pass a shard client explicitly into services.
Audit at least:
- auth controller: login/register/me/refresh/logout/change password
- user, project, task, comment, notification, dashboard controllers
- notification.service.js
- plan and subscription controllers
- background jobs, cron jobs, webhooks, seed scripts and tests

Plan catalog data is usually global reference data; either replicate it to all
shards or keep it in the control database. Razorpay webhooks must resolve the
organization/user from a trusted payment/order reference before selecting a
shard.

Dashboard totals become per-shard totals. A global dashboard must query all
three shards and aggregate results, or use a separately maintained analytics
store. Never assume a Prisma transaction spans shards.

## Step 6 - operational safety

- Keep one Prisma client/pool per shard per Node process; size pool limits across
  all replicas so total connections stay below PostgreSQL max_connections.
- Add graceful shutdown for HTTP server, Prisma clients and pg pools.
- Use an outbox/retry mechanism for events that need effects on another shard.
- Add tenant isolation tests for every read/update/delete endpoint.
- Add health checks per shard, backups, restore drills, metrics and alerting.
- For tenant movement, set status=MIGRATING, pause writes or dual-write with
  an outbox, copy and validate data, atomically update shardId, then resume.
  Do not simply change shardId while writes are active.

## Step 7 - application switch

Only after all endpoints, background workers and tests use shard-aware access:
1. deploy with routing disabled;
2. verify all three shard connections and registry mappings;
3. enable routing for a test organization;
4. compare old/new reads and write results;
5. progressively enable organizations;
6. retain rollback capability until the observation window passes.

## Current code status

config/shardManager.js creates lazy Prisma clients for the three shard URLs.
config/shardRegistry.js reads persisted mappings from the control database.
middlewares/shard.middleware.js attaches req.db after authentication.
These are infrastructure primitives. Existing routes/controllers still use the
legacy single DATABASE_URL and must be migrated before enabling this middleware.
