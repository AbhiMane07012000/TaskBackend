const express = require('express');
const router = express.Router();

const { protect, adminOnly, superAdminOnly } = require('../auth/auth.middleware');
// const { createProjectRateLimiter } = require('../../middlewares/projectRateLimit.middleware');
const {createProject,getProjects,getProjectById,updateProject,deleteProject, getProjectsUser,addUserToProject, removeUserFromProject } = require('./project.controller');

router.post('/', protect, superAdminOnly, createProject);

router.get('/', protect, getProjects);

router.get('/:id', protect, getProjectById);

router.patch('/:id', protect, adminOnly, updateProject);

router.delete('/:id', protect, superAdminOnly , deleteProject);

router.get('/:id/users', protect, getProjectsUser);

router.post('/:id/users', protect, adminOnly, addUserToProject);

router.delete('/:id/users', protect, adminOnly, removeUserFromProject);

module.exports = router;