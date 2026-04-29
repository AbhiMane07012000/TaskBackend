const prisma = require("../../config/db");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing user notifications
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully
 *       400:
 *         description: Bad Request - User ID is required to fetch notifications
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       404:
 *         description: Not Found - No notifications found for the user
 *       500:
 *         description: Internal Server Error
 */
const getNotifications = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required to fetch notifications",
    });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    if (!notifications) {
      return res.status(404).json({
        status: "error",
        message: "No notifications found",
      });
    }

    return res.json({
      status: "success",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       400:
 *         description: Bad Request - Notification ID is required to mark as read
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       404:
 *         description: Not Found - Notification not found with the given ID
 *       500:
 *         description: Internal Server Error
 */
const markAsRead = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id || !userId) {
    return res.status(400).json({
      status: "error",
      message: "Notification ID and User ID are required to mark as read",
    });
  }

  try {
    const markAsRead = await prisma.notification.findUnique({
      where: { id: id , userId: userId },
    });

  

    if (!markAsRead) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    if (markAsRead.isRead) {
      return res.status(400).json({
        status: "error",
        message: "Notification is already read",
      });
    }

    await prisma.notification.update({
      where: { id: id , userId: userId },
      data: { isRead: true },
    });

    res.status(200).json({
      status: "success",
      message: "Notification marked as read",
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

const markAllAsRead = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required to mark notifications as read",
    });
  }

  try {

    await prisma.notification.updateMany({
      where: { userId: userId },
      data: { isRead: true },
    });

    res.status(200).json({
      status: "success",
      message: "All notifications marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to mark notifications as read",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
