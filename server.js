// List the dependencies here.
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');


//Connect to mysql database
const connection = mysql.createConnection(
    {
      host: '127.0.0.1',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'employee_DB'
    },
    console.log('Connected to Employee Database.')
  );

connection.query = util.promisify(connection.query)


// Begin the application after establishing the connection.
connection.connect(function (err) {
    if (err) throw err;
    initialPrompt();
})

// Give the user a pleasant welcome message.
console.table(
    "\n------WELCOME TO EMPLOYEE TRACKER -------\n"
)

// Ask the user initial action question to figure out what they would like to do.
const initialPrompt = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View Employees',
                'View Departments',
                'View Roles',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role',
                'Exit'
            ]
        });
        switch (answer.action) {
            case 'View Employees':
                employeeView();
                break;

            case 'View Departments':
                departmentView();
                break;

            case 'View Roles':
                roleView();
                break;

            case 'Add Employees':
                employeeAdd();
                break

            case 'Add Departments':
                departmentAdd();
                break

            case 'Add Roles':
                roleAdd();
                break

            case 'Update Employee Role':
                employeeUpdate();
                break

            case 'Exit':
                connection.end();
                break;
        };
    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}

// view all enmployees function
const employeeView = async () => {
    console.log('Employee View');
    try {
        let query = 'SELECT e.id AS ID, e.first_name AS FIRST, e.last_name AS LAST, role.title as TITLE, department.department_name AS Department, role.salary as Salary, m. first_name AS Manager FROM employee e JOIN role ON e.role_id=role.id JOIN department on role.department_id=department.id INNER JOIN employee m ON m.id=e.manager_id ORDER BY e.id';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeArray = [];
            res.forEach(employee => employeeArray.push(employee));
            console.table(employeeArray);
            initialPrompt();
        });
    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}

// view all dpts function
const departmentView = async () => {
    console.log('Department View');
    try {
        let query = 'SELECT department.id AS ID, department_name AS NAME FROM department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentArray = [];
            res.forEach(department => departmentArray.push(department));
            console.table(departmentArray);
            initialPrompt();
        });
    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}

// view all roles function
const roleView = async () => {
    console.log('Role View');
    try {
        let query = 'SELECT role.id AS ID, role.title AS Title, role.salary AS Salary, department.department_name AS Department FROM role INNER JOIN department ON role.department_id=department.id';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleArray = [];
            res.forEach(role => roleArray.push(role));
            console.table(roleArray);
            initialPrompt();
        });
    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}

// add new employee function
const employeeAdd = async () => {
    try {
        console.log('Employee Add');

        let roles = await connection.query("SELECT * FROM role");

        let managers = await connection.query("SELECT * FROM employee");

        let answer = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name?"
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name?"
            },
            {
                name: 'employeeRoleId',
                type: 'list',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    }
                }),
                message: "What is the employee's role?"
            },
            {
                name: 'employeeManagerId',
                type: 'list',
                choices: managers.map((manager) => {
                    return {
                        name: manager.first_name + " " + manager.last_name,
                        value: manager.id
                    }
                }),
                message: "Who is this employee's manager?"
            }
        ])

        let result = await connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: (answer.employeeRoleId),
            manager_id: (answer.employeeManagerId)
        });

        console.log(`${answer.firstName} ${answer.lastName} added to database.\n`);
        initialPrompt();

    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}

//  add a new dpt function
const departmentAdd = async () => {
    try {
        console.log('Department Add');

        let answer = await inquirer.prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'What is the name of the department?'
            }
        ]);

        let result = await connection.query("INSERT INTO department SET ?", {
            department_name: answer.deptName
        });

        console.log(`${answer.deptName} added to departments.\n`)
        initialPrompt();

    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}

//  add a new role function
const roleAdd = async () => {
    try {
        console.log('Role Add');

        let departments = await connection.query("SELECT * FROM department")

        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role?'
            },
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map((departmentId) => {
                    return {
                        name: departmentId.department_name,
                        value: departmentId.id
                    }
                }),
                message: 'Which department does the role belong to?',
            }
        ]);
        
        let chosenDepartment;
        for (i = 0; i < departments.length; i++) {
            if(departments[i].department_id === answer.choice) {
                chosenDepartment = departments[i];
            };
        }
        let result = await connection.query("INSERT INTO role SET ?", {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.departmentId
        })

        console.log(`${answer.title} role added to database.\n`)
        initialPrompt();

    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}

// update a role for a specific employee
const employeeUpdate = async () => {
    try {
        console.log('Employee Update');
        
        let employees = await connection.query("SELECT * FROM employee");

        let employeeSelection = await inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                choices: employees.map((employeeName) => {
                    return {
                        name: employeeName.first_name + " " + employeeName.last_name,
                        value: employeeName.id
                    }
                }),
                message: 'Which employee do you want to update?'
            }
        ]);

        let roles = await connection.query("SELECT * FROM role");

        let roleSelection = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: roles.map((roleName) => {
                    return {
                        name: roleName.title,
                        value: roleName.id
                    }
                }),
                message: 'Please select the role to update the employee with.'
            }
        ]);

        let result = await connection.query("UPDATE employee SET ? WHERE ?", [{ role_id: roleSelection.role }, { id: employeeSelection.employee }]);

        console.log(`The role was successfully updated.\n`);
        initialPrompt();

    } catch (err) {
        console.log(err);
        initialPrompt();
    };
}