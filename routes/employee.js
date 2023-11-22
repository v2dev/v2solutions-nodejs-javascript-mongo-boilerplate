const express = require("express");
const auth = require("../services/authentication");
const Employee = require("../model/Employee");
const {
  getEmployees,
  addEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/EmployeeController");

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     GetEmployee:
 *       type: object
 *       required:
 *         - sortedColumn
 *         - limit
 *         - page
 *         - sort
 *         - filter
 *
 *       properties:
 *         sortedColumn:
 *           type: string
 *           description: Require column name on which sorting will be performed.
 *         limit:
 *           type: number
 *           description: limit the data
 *         page:
 *           type: number
 *           description: page number
 *         sort:
 *           type: string
 *           description: Provide 'asc' and 'desc'
 *         filter:
 *           type: string
 *           description: It will filter the data i.e search
 *       example:
 *           sortedColumn: name,
 *           limit: 5,
 *           page: 1,
 *           dob: 16/05/1981,
 *           sort: desc,
 *           filter: afsar,
 *
 *     Add:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - dob
 *         - designation
 *         - education
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the employee
 *         email:
 *           type: string
 *           description: email
 *         dob:
 *           type: string
 *           description: dob
 *         designation:
 *           type: string
 *           description: designation
 *         education:
 *           type: string
 *           description: education
 *       example:
 *         name: "Afsar"
 *         email: "afsar@gmail.com"
 *         dob: "20/05/1993"
 *         designation: "Software Engineer"
 *         education: "BE"
 */

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: CRUD Operation on Employees data
 */

/**
 * @swagger
 * /employee/get:
 *   get:
 *     security:
 *       - Authorization: []
 *     summary: Fetch all the employees list
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           required: true
 *           description: limit the docs
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           required: true
 *           description: Number of pages
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           description: It will filter bases on the name column.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           description: Sorting - 'asc' or 'desc'
 *       - in: query
 *         name: sortedColumn
 *         schema:
 *           type: string
 *           description: Column name i.e email, dob, desgination...
 *     responses:
 *       200:
 *         description: It will display record based on the filter applied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetEmployee'
 *       500:
 *         description: Some server error
 */

router.get("/get", auth, getEmployees);
//router.get("/get", auth, EmployeeController);

/**
 * @swagger
 * /employee/add:
 *   post:
 *     security:
 *       - Authorization: []
 *     summary: Add New Employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Add'
 *     responses:
 *       200:
 *         description: New Employee will be added.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Add'
 *       500:
 *         description: Some server error
 */

router.post("/add", auth, addEmployees);

/**
 * @swagger
 * /employee/update/{id}:
 *   put:
 *     security:
 *       - Authorization: []
 *     summary: Fetch all the employees list
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Add'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           required: true
 *           description: Id of the employee
 *     responses:
 *       200:
 *         description: Update employee data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Add'
 *       500:
 *         description: Some server error
 */

router.put("/update/:id", auth, updateEmployee);

/**
 * @swagger
 * /employee/delete/{id}:
 *   delete:
 *     security:
 *       - Authorization: []
 *     summary: Delete employee by unique id
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           required: true
 *           description: Id of the employee
 *     responses:
 *       200:
 *         description: Update employee data
 *         content:
 *           application/json:
 *       500:
 *         description: Some server error
 */

router.delete("/delete/:id", auth, deleteEmployee);

module.exports = router;
