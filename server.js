
const mysql = require('mysql2');
const inquirer = require("inquirer");
require('dotenv').config();

function connectDb () {
    // Connect to database
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
            if (response.selection === "View all Departments") {
                // View all Departments
                const dep_conn = connectDb();

                dep_conn.query('SELECT * FROM department', function (err, results) {
                  console.info(results);
                });

                dep_conn.end()

            }

            renderMenu();
        })
}

renderMenu()