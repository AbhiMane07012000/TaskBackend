const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../auth/auth.middleware');
const {createProject,getProjects,getProjectById,updateProject,deleteProject, getProjectsUser,addUserToProject, removeUserFromProject } = require('./project.controller');

router.post('/', protect, createProject);

router.get('/', protect, getProjects);

router.get('/:id', protect, getProjectById);

router.patch('/:id', protect, updateProject);

router.delete('/:id', protect, adminOnly , deleteProject);

router.get('/:id/users', protect, getProjectsUser);

router.post('/:id/users', protect, adminOnly, addUserToProject);

router.delete('/:id/users', protect, adminOnly, removeUserFromProject);

module.exports = router;