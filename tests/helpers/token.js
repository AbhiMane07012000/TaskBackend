const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "route-tests-secret";

module.exports = (role = "USER", id = "route-test-user") =>
  jwt.sign({ id, role, username: id }, process.env.JWT_SECRET);
