const express = require("express");
const { protect, adminOnly, superAdminOnly, AdminOrSuperAdmin } = require("../auth/auth.middleware");
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignUserToTask,
    getTaskAssignees,
    removeUserFromTask,
    getCommentsByTask
} = require("./task.controller");

const router = express.Router();

router.post("/", protect, AdminOrSuperAdmin, createTask);
router.get("/", protect, getTasks);

router.get("/:id", protect, getTaskById);
router.patch("/:id", protect, updateTask);
router.delete("/:id", protect, superAdminOnly, deleteTask);

router.patch("/:id/assign", protect, AdminOrSuperAdmin ,assignUserToTask);
router.delete("/:id/remove", protect, adminOnly, removeUserFromTask);
router.get("/:id/assignees", protect, getTaskAssignees);

router.get("/:id/comments", protect, getCommentsByTask);

module.exports = router;
