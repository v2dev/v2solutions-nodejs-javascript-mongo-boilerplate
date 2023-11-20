const express = require("express");
const cors = require("cors");
const UserRoute = require("./routes/user");
const EmployeeRoute = require("./routes/employee");
const connection = require("./connection");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Boiler plate",
      version: "1.0.0",
      description:
        "A simple Express Server with SignIn and Sign Up and CRUD Operation on employee table",
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here>",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", UserRoute);
app.use("/employee", EmployeeRoute);

module.exports = app;
