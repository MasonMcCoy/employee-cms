const inquirer = require("inquirer");

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
                return;
            }
            console.log(response.selection);
            renderMenu();
        })
}

renderMenu();