
const mysql = require('mysql2');
const inquirer = require("inquirer");
const cTable = require("console.table");
require('dotenv').config();

// Db connection credentials
const connection = mysql.createConnection(
    {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    }
);

// Connect to db and run Inquirer menu prompt
connection.connect(err => {
    if (err) {
        console.log(err)
    }
    renderMenu();
})

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
            if (response.selection === "Exit") {
                connection.end();
                return;
            }

            // View all Departments
            if (response.selection === "View all Departments") {
                connection.query("SELECT id AS 'ID', name AS 'Department' FROM department", (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    renderMenu();
                })
            }

            // View all Roles
            if (response.selection === "View all Roles") {
                const sql = "SELECT roles.id AS 'ID', title AS 'Title', name AS 'Department', salary AS 'Salary' FROM roles JOIN department ON roles.department_id = department.id;"

                connection.query(sql, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    renderMenu();
                })
            }

            // View all Employees
            if (response.selection === "View all Employees") {
            const sql = "SELECT employee.id AS 'ID', employee.first_name AS 'First Name', employee.last_name AS 'Last Name', roles.title AS 'Title', department.name AS 'Department', roles.salary AS 'Salary', CONCAT (manager.first_name, ' ', manager.last_name) AS 'Manager' FROM employee LEFT JOIN roles ON (employee.role_id = roles.id) LEFT JOIN department ON (department.id = roles.department_id) LEFT JOIN employee manager ON employee.manager_id = manager.id;"

            connection.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.table(results);
                renderMenu();
            })
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
                        // const conn = connectDb ();

                        conn.query(`INSERT INTO department (name) VALUES ("${answer.dept_name}")`, (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`${answer.dept_name} department added.`);
                            conn.end();
                            renderMenu();
                          });
                    })
            }

            // Add a Role
            if (response.selection === "Add a Role") {
                // const conn = connectDb ();
                conn.query(`SELECT name FROM department`, (err, results) => {
                    if (err) {
                        console.log(err);
                    };
                    console.log(results);
                    conn.end();})
                
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
                        type: "list",
                        message: "Which department does the role belong to?",
                        choices: qDepts,
                        name: "selDept"
                    }
                ])
                .then(answer => {
                    // const conn = connectDb ();

                    conn.query(`INSERT INTO roles (title, salary, department_id)
                    VALUES ("${answer.role}", ${parseFloat(answer.salary)}, ${parseInt(answer.dept_id)})`,
                    (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(`${answer.role} role added.`);
                        conn.end();
                        renderMenu();
                      });
                })
            }

            // Add an Employee
            if (response.selection === "Add an Employee") {
                inquirer
                .prompt([
                    {
                        type: "input",
                        message: "New Employee first name",
                        name: "fst_name"
                    },
                    {
                        type: "input",
                        message: "New Employee last name",
                        name: "lst_name"
                    },
                    {
                        type: "input",
                        message: "New Employee role ID",
                        name: "role_id"
                    },
                    {
                        type: "input",
                        message: "New Employee manager ID",
                        name: "mang_id"
                    }
                ])
                .then(answer => {
                    // const conn = connectDb ();

                    conn.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ("${answer.fst_name}", "${answer.lst_name}", ${parseInt(answer.role_id)}, ${parseInt(answer.mang_id)})`,
                    (err) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log(`Employee ${answer.fst_name} ${answer.lst_name} has been added.`);
                        conn.end();
                        renderMenu();
                    })
                })
            }
        })
}

// renderMenu()