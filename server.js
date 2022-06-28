
const mysql = require('mysql2');
const inquirer = require("inquirer");
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
function getTable(table, conn) {
    conn.query(`SELECT * FROM ${table}`, (err, results) => {
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
                getTable("department", connectDb())
            }

            // View all Roles
            if (response.selection === "View all Roles") {
                getTable("roles", connectDb())
            }

            // View all Employees
            if (response.selection === "View all Employees") {
                getTable("employee", connectDb())
            }

            renderMenu();
        })
}

renderMenu()