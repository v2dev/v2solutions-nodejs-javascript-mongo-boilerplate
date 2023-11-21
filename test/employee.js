const chai = require("chai");
const chaihttp = require("chai-http");
const app = require("../index");

chai.should();
chai.use(chaihttp);

let id;
// please enter JWT token here.
let token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzcmFyQGdtYWlsLmNvbSIsImlhdCI6MTcwMDU1MjY5MywiZXhwIjoxNzAwNTUzODkzfQ.TJ6NT6vG3D2jxdmi10P9JtlgenSNQEqVR9nca-OzCiE";

describe("Employee Crud", () => {
  describe("Add Employee", () => {
    it("Add new employee", (done) => {
      chai
        .request(app)
        .post("/employee/add")
        .set("Authorization", token)
        .send({
          name: "Afsar Shaikh",
          email: "afsar@gmail.com",
          dob: "16/05/1993",
          designation: "Senior Software Engineer",
          education: "BE",
        })
        .end((error, response, body) => {
          id = response.body.newEmployee._id;
          response.body.should.be.a("object");
          response.body.should.have.property("newEmployee");

          done();
        });
    });
  });
  describe("Get Employee", () => {
    it("fetch all employee list", (done) => {
      chai
        .request(app)
        .get("/employee/get")
        .set("Authorization", token)
        .query({
          sortedColumn: "education",
          limit: 5,
          page: 1,
          sort: "asc",
        })
        .end((error, response, body) => {
          response.body.should.be.a("object");
          response.body.should.have.property("employees");
          response.body.should.have.property("page");
          response.body.should.have.property("totalPages");
          response.body.should.have.property("totalEmployees");
          response.body.should.have.property("sortedColumn");
          response.body.should.have.property("sortDirection");
          done();
        });
    });
  });
  describe("Update Employee", () => {
    it("Update employee data", (done) => {
      chai
        .request(app)
        .put(`/employee/update/${id}`)
        .set("Authorization", token)
        .send({
          name: "Afsar Shaikh 111",
        })
        .end((error, response, body) => {
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eql("Updated Successfully");
          response.body.should.have.property("updated");
          done();
        });
    });
  });
  describe("Delete Employee", () => {
    it("delete employee by id", (done) => {
      chai
        .request(app)
        .delete(`/employee/delete/${id}`)
        .set("Authorization", token)
        .end((error, response, body) => {
          response.body.should.be.a("object");
          response.body.should.have
            .property("message")
            .eql(`Employee deleted successfully for id - ${id}`);
          done();
        });
    });
  });
});
