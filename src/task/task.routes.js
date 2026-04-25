const express = require("express");
const { protect, adminOnly } = require("../auth/auth.middleware");
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignUserToTask,
    getTaskAssignees,
    removeUserFromTask,
} = require("./task.controller");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.patch("/:id/assign", protect, adminOnly ,assignUserToTask);
router.delete("/:id/remove", protect, adminOnly, removeUserFromTask);
router.get("/:id/assignees", protect, getTaskAssignees);
router.get("/:id", protect, getTaskById);
router.patch("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

module.exports = router;
