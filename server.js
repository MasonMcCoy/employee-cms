
const mysql = require('mysql2');
const inquirer = require("inquirer");
const cTable = require("console.table");
require('dotenv').config();

// Create database connection
function connectDb () {
    const connection = mysql.createConnection(
        {
        host: 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
        },
        console.log(`Connected to the employee_db database.`)
    );

    return connection;
}

// Return all records of a given table
function getTable(table) {
    const conn = connectDb();

    conn.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        conn.end();
      });
}

// Render Inquirer CLI
function renderMenu() {
    inquirer
        .prompt([
            {
            type: "list",
            message: "What would you like to do?",
            // Maybe use Seperators here for formatting?
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role",
                "Exit"
            ],
            pageSize: 8,
            name: "selection"
            }
        ])
        .then(response => {
            console.log(response.selection);
            
            if (response.selection === "Exit") {
                return;
            }

            // View all Departments
            if (response.selection === "View all Departments") {
                getTable("department")
            }

            // View all Roles
            if (response.selection === "View all Roles") {
                getTable("roles")
            }

            // View all Employees
            if (response.selection === "View all Employees") {
                getTable("employee")
            }

            // Add a Department
            if (response.selection === "Add a Department") {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: "New Department Name",
                            name: "dept_name"
                        }
                    ])
                    .then(answer => {
                        const conn = connectDb ()

                        conn.query(`INSERT INTO department (name) VALUES ("${answer.dept_name}")`, (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(results);
                            conn.end();
                          });

                        renderMenu();
                    })
            }

            // Add a Role
            if (response.selection === "Add a Role") {
                inquirer
                .prompt([
                    {
                        type: "input",
                        message: "New Role Title",
                        name: "role"
                    },
                    {
                        type: "input",
                        message: "Role Salary",
                        name: "salary"
                    },
                    {
                        type: "input",
                        message: "Department ID",
                        name: "dept_id"
                    }
                ])
                .then(answer => {
                    const conn = connectDb ()

                    conn.query(`INSERT INTO roles (title, salary, department_id)
                    VALUES ("${answer.role}", ${parseFloat(answer.salary)}, ${parseInt(answer.dept_id)})`,
                    (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(results);
                        conn.end();
                      });

                    renderMenu();
                })
            }

            // Add an Employee
            if (response.selection === "Add an Employee") {
                inquirer
                .prompt([
                    {
                        type: "input",
                        message: "New Employee Name",
                        name: "emp_name"
                    }
                ])
                .then(answer => {
                    columns = "name"
                    addRecord("employee", columns, answer.emp_name)
                    renderMenu();
                })
            }
        })
}

renderMenu()