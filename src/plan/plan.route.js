const express = require("express");
const router = express.Router()

const {getPlans} = require('./plan.controller');


router.get("/", getPlans);

module.exports=router
