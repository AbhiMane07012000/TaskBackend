const prisma = require("../../config/db");

const { createNotification } = require("../notification/notification.service");

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 *
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdById:
 *           type: integer
 *     CreateProjectInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *     UpdateProjectInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectInput'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const project = await prisma.project.create({
      data: {
        name,
        createdBy: { connect: { id: req.user.id } },
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to create project.", error: error.message });
  }
};

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: No projects found
 *       500:
 *         description: Failed to fetch projects
 */
const getProjects = async (req, res) => {
  try {

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch projects.", error: error.message });
  }
};

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get a project by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (req.user.role !== "ADMIN" && project.createdById !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.status(200).json(project);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch project.", error: error.message });
  }
};

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProjectInput'
 *     responses:
 *       200:
 *         description: Updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (req.user.role !== "ADMIN" && project.createdById !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    const updatedFields = {};

    if (name !== undefined) updatedFields.name = name;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No update fields provided." });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updatedFields,
    });

    return res.status(200).json(updatedProject);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to update project.", error: error.message });
  }
};

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       204:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (req.user.role !== "ADMIN" && project.createdById !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    await prisma.project.delete({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to delete project.", error: error.message });
  }
};

/**
 *
 * @swagger
 *
 * /api/projects/{id}/users:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Add a user to a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
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
 *         description: User added to project successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project not found
 */

const addUserToProject = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check authorization (only admin or project creator can add users)
    if (req.user.role !== "ADMIN" && project.createdById !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user is already in the project
    const existingProjectUser = await prisma.project_User.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (existingProjectUser) {
      return res
        .status(400)
        .json({ message: "User is already working in this project." });
    }

    await prisma.project_User.create({
      data: {
        project: { connect: { id: projectId } },
        user: { connect: { id: userId } },
      },
    });

    await createNotification(
      userId,
      "PROJECT_UPDATED",
      `You have been added to project: ${project.name}`
    )

    return res
      .status(200)
      .json({ message: "User added to project successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to add user to project.",
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/projects/{projectId}/users:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all users working in a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of users working in the project
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
 *         description: Project not found
 */
const getProjectsUser = async (req, res) => {
  try {
    const { id: projectId } = req.params;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check authorization (only admin or project creator can view users)
    if (req.user.role !== "ADMIN" && project.createdById !== req.user.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Get all users working in the project
    const projectUsers = await prisma.project_User.findMany({
      where: { projectId },
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

    const users = projectUsers.map((pu) => pu.user);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to fetch project users.",
      error: error.message,
    });
  }
};

/**
 * @swagger
 *
 * /api/projects/{id}/users:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Remove a user from a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
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
 *         description: User removed from project successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Project or user not found
 */
const removeUserFromProject = async (req, res) => {
  const { id: projectId } = req.params;
  const { userId } = req.body;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const ProjectUser = await prisma.project_User.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!ProjectUser) {
      return res
        .status(404)
        .json({ message: "User is not part of the project." });
    }

    await prisma.project_User.delete({
      where: { projectId_userId: { projectId, userId } },
    });

    return res
      .status(200)
      .json({ message: "User removed from project successfully." });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to remove user from project.",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addUserToProject,
  getProjectsUser,
  removeUserFromProject,
};
