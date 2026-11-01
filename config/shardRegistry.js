const { Pool } = require("pg");

let controlPool;

function getControlPool() {
  if (!process.env.CONTROL_DATABASE_URL) {
    throw new Error("CONTROL_DATABASE_URL is required for shard routing");
  }

  if (!controlPool) {
    controlPool = new Pool({
      connectionString: process.env.CONTROL_DATABASE_URL,
      max: Number(process.env.CONTROL_POOL_MAX || 5),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      application_name: "taskbackend-control",
    });
  }

  return controlPool;
}

/**
 * Resolve a tenant's database from the authoritative control-plane registry.
 * Never accept shardId from a request body, query string, or arbitrary header.
 */
async function getOrganizationShard(organizationId) {
  if (!organizationId || typeof organizationId !== "string") {
    throw new Error("A valid organizationId is required");
  }

  const result = await getControlPool().query(
    `SELECT "shardId", status
       FROM "OrganizationDirectory"
      WHERE id = $1
      LIMIT 1`,
    [organizationId],
  );

  const organization = result.rows[0];

  if (!organization || organization.status !== "ACTIVE") {
    return null;
  }

  return organization.shardId;
}

async function closeControlPool() {
  if (controlPool) {
    await controlPool.end();
    controlPool = undefined;
  }
}

module.exports = { getOrganizationShard, closeControlPool };
