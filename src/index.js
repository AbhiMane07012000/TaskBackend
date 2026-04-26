const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const morgan = require('morgan');


const swaggerSpec = require("../config/swagger");

dotenv.config();


const app = express();

app.use(cors({
  origin: ["http://localhost:3000"], // add frontend URL
  credentials: true,                                          // allow cookies
}));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());

const authRoutes = require("./auth/auth.routes");
const taskRoutes = require("./task/task.routes");
const projectRoutes = require("./project/project.route");
const userRoutes = require("./user/user.route");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));