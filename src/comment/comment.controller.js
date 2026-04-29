const prisma = require("../../config/db");
const { createNotification } = require("../notification/notification.service");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing user comments on tasks
 */

const extractMentions = (text) => {
  const regex = /@(\w+)/g;
  const matches = [...text.matchAll(regex)];
  return matches.map((m) => m[1]); // ["abhijeet", "john"]
};

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               taskId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
const createComment = async (req, res) => {
  const { content, taskId } = req.body;
  const userId = req.user.id;

  if (!content || !taskId) {
    return res.status(400).json({ error: "Content and taskId are required" });
  }

  if (typeof content !== "string" || content.trim() === "") {
    return res
      .status(400)
      .json({ error: "Content must be a non-empty string" });
  }

  try {
    const mentionedUsers = extractMentions(content);

    for (const username of mentionedUsers) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (user) {
        const taskUser = await prisma.task_User.findFirst({
          where: { taskId, userId: user.id },
        });

        if (!taskUser) {
          return res.status(400).json({
            error: `User @${username} is not assigned to this task`,
          });
        }
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        createdById: userId,
      },
    });

    await Promise.all(
      mentionedUsers.map(async (username) => {
        const user = await prisma.user.findUnique({
          where: { username },
          select: { id: true },
        });

        if (user) {
          await createNotification(
            user.id,
            "TASK_COMMENT_MENTION",
            `You were mentioned in a comment: "${content}"`,
          );
        }
      }),
    );

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
};

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     tags: [Comments]
 *     summary: Update a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  if (typeof content !== "string" || content.trim() === "") {
    return res
      .status(400)
      .json({ error: "Content must be a non-empty string" });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: id },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.createdById !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const updatedComment = await prisma.comment.update({
      where: { id: id },
      data: { content },
    });
    res.json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: id },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.createdById !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await prisma.comment.delete({
      where: { id: id },
    });
    res
      .status(204)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
