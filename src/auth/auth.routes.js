const express = require("express");
const { register, login, me, refresh, logout , changePassword} = require("./auth.controller");
const {protect,adminOnly} = require("./auth.middleware");
const { loginRateLimiter, registerRateLimiter } = require("../../middlewares/authRateLimit.middleware");

const router = express.Router();

router.post("/register", registerRateLimiter, register);


router.post("/login", loginRateLimiter, login);


router.post("/refresh", refresh);


router.post("/logout", protect, logout);


router.get("/me", protect, me);


router.put("/change-password", protect, changePassword);


module.exports = router;