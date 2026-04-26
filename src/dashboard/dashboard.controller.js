const prisma = require("../../config/db");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard data and analytics
 * components:
 *   schemas:
 *     DashboardData:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *         totalProjects:
 *           type: integer
 *         totalTasks:
 *           type: integer
 *         taskStatusCount:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *         userRoleCount:
 *           type: object
 *           additionalProperties:
 *             type: integer
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard data and analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardData'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       500:
 *         description: Error fetching dashboard data
 */
const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProjects = await prisma.project.count();
    const totalTasks = await prisma.task.count();

    const taskstatuscount = await prisma.task.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const userRoleCount = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    return res.status(200).json({
      totalUsers,
      totalProjects,
      totalTasks,
      taskStatusCount: taskstatuscount.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {}),
      userRoleCount: userRoleCount.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {}),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
};

module.exports = {
  getDashboardData,
};
