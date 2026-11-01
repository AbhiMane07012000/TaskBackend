const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const SHARD_IDS = ["shard1", "shard2", "shard3"];

const shardUrls = {
  shard1: process.env.SHARD_1_DATABASE_URL,
  shard2: process.env.SHARD_2_DATABASE_URL,
  shard3: process.env.SHARD_3_DATABASE_URL,
};

const clients = new Map();
const pools = new Map();

function getPrismaClient(shardId) {
  if (!SHARD_IDS.includes(shardId)) {
    throw new Error(`Unknown shard ID: ${shardId}`);
  }

  if (!shardUrls[shardId]) {
    throw new Error(`Database URL is not configured for ${shardId}`);
  }

  if (!clients.has(shardId)) {
    const pool = new Pool({
      connectionString: shardUrls[shardId],
      max: Number(process.env.SHARD_POOL_MAX || 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      application_name: `taskbackend-${shardId}`,
    });

    const client = new PrismaClient({
      adapter: new PrismaPg(pool),
    });

    pools.set(shardId, pool);
    clients.set(shardId, client);
  }

  return clients.get(shardId);
}

async function disconnectShards() {
  await Promise.all([...clients.values()].map((client) => client.$disconnect()));
  await Promise.all([...pools.values()].map((pool) => pool.end()));
  clients.clear();
  pools.clear();
}

module.exports = {
  SHARD_IDS,
  getPrismaClient,
  disconnectShards,
};
