const express = require("express");
const { protect, adminOnly, superAdminOnly, AdminOrSuperAdmin } = require("../auth/auth.middleware");

const {getNotifications, markAsRead, markAllAsRead}= require("./notification.controller");
const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead)
router.patch("/read-all", protect, markAllAsRead)

module.exports = router;