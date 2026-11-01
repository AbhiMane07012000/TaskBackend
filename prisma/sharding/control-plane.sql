-- Run this against a NEW control database, not an application shard.
-- Back up databases and test this script in a non-production environment first.

CREATE TABLE IF NOT EXISTS "OrganizationDirectory" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "shardId" TEXT NOT NULL CHECK ("shardId" IN ('shard1', 'shard2', 'shard3')),
  status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'MIGRATING', 'SUSPENDED')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "OrganizationDirectory_shardId_idx"
  ON "OrganizationDirectory" ("shardId");

-- Identity directory supports login before the application knows a shard.
-- Keep credentials in the control plane OR keep this as a locator and perform
-- credential verification against the selected shard. Choose one model
-- consistently; do not maintain two independently writable password copies.
CREATE TABLE IF NOT EXISTS "UserDirectory" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  "organizationId" TEXT NOT NULL
    REFERENCES "OrganizationDirectory"(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'DISABLED')),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "UserDirectory_organizationId_idx"
  ON "UserDirectory" ("organizationId");
