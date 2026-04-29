const prisma = require("../../config/db");
const { createNotification } = require("../notification/notification.service");

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 *
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - IN_PROGRESS
 *             - COMPLETED
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdById:
 *           type: integer
 *     CreateTaskInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - projectId
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         projectId:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - IN_PROGRESS
 *             - COMPLETED
 *     UpdateTaskInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - IN_PROGRESS
 *             - COMPLETED
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create a new task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
const createTask = async (req, res) => {
  try {
    const { title, description, projectId } = req.body;

    if (!title || !description || !projectId) {
      return res
        .status(400)
        .json({ message: "Title, description, and projectId are required." });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (req.user.role !== "ADMIN" && project.createdById !== req.user.id) {
      const projectUser = await prisma.project_User.findUnique({
        where: { projectId_userId: { projectId, userId: req.user.id } },
      });

      if (!projectUser) {
        return res.status(403).json({ message: "Access denied." });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        createdBy: { connect: { id: req.user.id } },
        project: { connect: { id: projectId } },
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to create task.", error: error.message });
  }
};

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - IN_PROGRESS
 *             - COMPLETED
 *         description: Filter tasks by status
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 */
const getTasks = async (req, res) => {
  try {
  
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch tasks.", error: error.message });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get a task by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (req.user.role !== "ADMIN" && task.createdById !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch task.", error: error.message });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Update a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const oldtask = await prisma.task.findUnique({ where: { id } });

    if (!oldtask) {
      return res.status(404).json({ message: "Task not found." });
    }


    const updatedFields = {};

    if (title !== undefined) updatedFields.title = title;
    if (description !== undefined) updatedFields.description = description;
    if (status !== undefined) updatedFields.status = status;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No update fields provided." });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updatedFields,
    });

    if(status && oldtask.status !== status){
      const taskUsers = await prisma.task_User.findMany({
        where: { taskId: id },
      });

      await Promise.all(
        taskUsers.map((taskUser) =>
          createNotification(
            taskUser.userId,
            "TASK_UPDATED",
            `Task "${updatedTask.title}" status has been updated.`
          )
        )
      );
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to update task.", error: error.message });
  }
};

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (req.user.role !== "ADMIN" && task.createdById !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    await prisma.task.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to delete task.", error: error.message });
  }
};

/**
 * @swagger
 * /api/tasks/{id}/assign:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Assign a user to a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User assigned to task successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task or user not found
 */
const assignUserToTask = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingTaskUser = await prisma.taskUser.findUnique({
      where: { taskId_userId: { taskId, userId } },
    });

    if (existingTaskUser) {
      return res
        .status(400)
        .json({ message: "User is already assigned to this task." });
    }

    await prisma.taskUser.create({
      data: {
        task: { connect: { id: taskId } },
        user: { connect: { id: userId } },
      },
    });

    await createNotification(
      userId,
      "TASK_ASSIGNED",
      `You have been assigned to task: ${task.title}`
    );

    return res
      .status(200)
      .json({ message: "User assigned to task successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to assign user to task.",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tasks/{id}/remove:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Remove a user from a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User removed from task successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task or user not found
 */
const removeUserFromTask = async (req, res) => {

  const { id: taskId } = req.params;
  const { userId } = req.body;

  console.log("Removing user from task:", { taskId, userId });

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is Required." });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ message: "Task not Found" });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const existingUser = await prisma.taskUser.findUnique({
      where: { taskId_userId: { taskId, userId } },
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User is not assigned to this task." });
    }

    await prisma.taskUser.delete({
      where: { taskId_userId: { taskId, userId } },
    });

    return res.status(200).json({message:"User removed from task successfully"})

  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Unable to remove user from task.",
        error: error.message,
      });
  }
};

/**
 * @swagger
 * /api/tasks/{id}/assignees:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get all users assigned to a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: List of users assigned to the task
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
const getTaskAssignees = async (req, res) => {
  try {
    const { id: taskId } = req.params;

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const taskUsers = await prisma.taskUser.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    const assignees = taskUsers.map((tu) => tu.user);

    return res.status(200).json(assignees);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch task assignees.",
      error: error.message,
    });
  }
};


const getCommentsByTask = async (req, res) => {
  const { id:taskId } = req.params;
  console.log("Fetching comments for taskId:", taskId);

  try {
    const comments = await prisma.comment.findMany({
      where: { taskId },
      // include: { task: true, createdBy: true}, // include related task and user info if needed
    });

    if (!comments) {
      return res.status(404).json({
        success: false,
        error: "No comments found for this task",
      });
    }

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignUserToTask,
  getTaskAssignees,
  removeUserFromTask,
  getCommentsByTask,
};
