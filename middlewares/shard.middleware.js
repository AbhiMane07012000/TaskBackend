const { getOrganizationShard } = require("../config/shardRegistry");
const { SHARD_IDS, getPrismaClient } = require("../config/shardManager");

/**
 * Must run after JWT authentication.
 * The organizationId must come from a verified identity/directory lookup,
 * never directly from client-controlled input.
 */
async function shardMiddleware(req, res, next) {
  try {
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(403).json({
        message: "Authenticated identity is not associated with an organization",
      });
    }

    const shardId = await getOrganizationShard(organizationId);

    if (!shardId || !SHARD_IDS.includes(shardId)) {
      return res.status(404).json({ message: "Organization routing not found" });
    }

    req.organizationId = organizationId;
    req.shardId = shardId;
    req.db = getPrismaClient(shardId);

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = shardMiddleware;
