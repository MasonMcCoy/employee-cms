
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
                        connection.query(`INSERT INTO department (name) VALUES ("${answer.dept_name}")`, (err, results) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`${answer.dept_name} department added.`);
                            
                            renderMenu();
                          });
                    })
            }

            // Add a Role
            if (response.selection === "Add a Role") {
                connection.query(`SELECT name FROM department`, (err, results) => {
                    if (err) {
                        console.log(err);
                    };
                    const qDepts = results.map(dept => dept.name);

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
                            connection.query(`INSERT INTO roles (title, salary, department_id)
                            VALUES ("${answer.role}", ${parseFloat(answer.salary)}, ${qDepts.indexOf(answer.selDept) + 1})`,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                }
                                console.log(`${answer.role} role added.`);
                                renderMenu();
                            });
                        })
                    })
            }

            // Add an Employee
            if (response.selection === "Add an Employee") {
                connection.query(`SELECT title FROM roles`, (err, results) => {
                    if (err) {
                        console.log(err);
                    };
                    const qRoles = results.map(role => role.title);

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
                                type: "list",
                                message: "What is the employee's role?",
                                choices: qRoles,
                                name: "role_id"
                            }
                        ])
                        .then(answer => {
                            connection.query(`SELECT employee.id, first_name, last_name, manager_id, title FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id WHERE title = "${answer.role_id}" AND manager_id IS NULL;`, 
                            (err, results) => {
                                if (err) {
                                    console.log(err);
                                }

                                // Determines department manager, assigns first employee added to department as manager
                                let roleMang = results.map(mang => mang.id);
                                if (roleMang.length < 1) {
                                    roleMang = null;
                                }

                                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.fst_name}", "${answer.lst_name}", ${qRoles.indexOf(answer.role_id) + 1}, ${roleMang})`, (err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    console.log(`${answer.fst_name} ${answer.lst_name} added as employee.`);
                                    renderMenu();
                                })
                            })
                        })
                })
            }

            // Update an employee's role
            // THIS DOES NOT FULLY WORK
            if (response.selection === "Update an Employee Role") {
                connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee;", (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    
                    console.log(results)
                    const empNames = results.map(emp => emp.name);
                    console.log(empNames);

                    inquirer
                        .prompt([
                            {
                                type: "list",
                                message: "Choose an employee to update:",
                                choices: empNames,
                                name: "up_emp"
                            }
                        ])
                        .then(answer => {
                            const empID = empNames.indexOf(answer.up_emp) + 1
                            connection.query(`SELECT * FROM employee WHERE id = ${empID}`, (err, results) => {
                                if (err) {
                                    console.log(err)
                                }

                                const empRole = results.map(role => role.role_id)

                                connection.query(`SELECT role.id, employee.id FROM roles JOIN employee ON roles.id = employee.role_id WHERE employee.role_id != ${empRole} AND manager_id IS NULL`,
                                (err, results) => {
                                    if (err) {
                                        console.log(err);
                                    }

                                    console.log(results);
                                    const newRoles = results.map(role => role.title);
                                    const newMang = results.map(mang => mang.id);

                                    console.log(newRoles);
                                    console.log(newMang);

                                    inquirer
                                        .prompt([
                                            {
                                                type: "list",
                                                message: "Assign a New Role:",
                                                choices: newRoles,
                                                name: "new_role"
                                            }
                                        ])
                                        .then(answer => {
                                            console.log(answer);

                                            connection.query(`UPDATE employee SET role_id = ${newRoles.indexOf(answer.new_role) + 1}, manager_id = ${newRoles.indexOf(newMang)} WHERE id = ${empID}`, (err) => {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                console.log("Employee updated!");
                                                renderMenu();
                                            })
                                        })
                                })
                            })
                        })
                })
            }
        })
}
