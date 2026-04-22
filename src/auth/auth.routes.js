const express = require("express");
const { register, login, me, refresh, logout, changeUserRole} = require("./auth.controller");
const {protect,adminOnly} = require("./auth.middleware");

const router = express.Router();

router.post("/register", register);


router.post("/login", login);


router.post("/refresh", refresh);


router.post("/logout", protect, logout);


router.get("/me", protect, me);

router.patch("/change-user-role", protect, adminOnly, changeUserRole);

module.exports = router;