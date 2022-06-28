
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
    conn = connectDb();

    conn.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
        conn.end();
      });
}

function addRecord(table, cols, answers) {
    conn = connectDb();

    conn.query(`INSERT INTO ${table} (${cols}) VALUES ("${answers}")`, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(results);
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
                        columns = "name"
                        addRecord("department", columns, answer.dept_name)
                        renderMenu();
                    })
            }

            // Add a Role
            if (response.selection === "Add a Role") {
                
            }

            // Add an Employee
            if (response.selection === "Add an Employee") {
                
            }
        })
}

renderMenu()