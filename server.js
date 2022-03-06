const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require('dotenv').config();

const db = mysql.createConnection(
    {
      host: process.env.SQL_HOST,
      // MySQL username,
      user: process.env.SQL_USER,
      // MySQL password
      password: process.env.SQL_PASSWORD, 
      database: process.env.SQL_DATABSE
    },
    console.log(`Connected to the Employees database.`)
  );

var questionsAction = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ["View all Departments",
                  "View all Roles",
                  "View all Employees",
                  "Add a Department",
                  "Add a Role",
                  "Add an Employee",
                  "Update an Employee Role",
                  "Update Employee Managers",
                  "View Employees by Manager",
                  "View Employees by Department",
                  "Delete Department",
                  "Delete Role",
                  "Delete Employee",
                  "View Total Utilized Budget of Deparment",
                  "Finished!",
                  new inquirer.Separator()               
                ]
    },
];

//Asks what the user would like to do
function newAction (){

    inquirer.prompt(questionsAction)
    .then(switchFunction)
}

//Runs function depends on team member role response
function switchFunction (questionsAction) {

    switch(questionsAction.action){
        
        case "View all Departments":
            viewDep();// Function get all departments            
            break;

        case "View all Roles":
            viewRole();// Function get all roles            
            break;

        case "View all Employees":
            viewEmployee();// Function get all employees            
            break;
            
        case "Add a Department":
            addDept ();//Function Adds a Department           
            break;

        case "Add a Role":
            addRole ();//Function Adds a Role           
            break;

        case "Add an Employee":
            addEmployee ();//Function Adds an employee 
            break;
            
        case "Update an Employee Role":
            updateRole();//Function Update Employees Role
            break;

        case "Update Employee Managers":
            updateMan();//Function updates the employees manager
            break;

        case "View Employees by Manager":
            viewEmpMan ();// Function view employees by manager
            break;

        case "View Employees by Department":
            viewEmpDept ();// Function view employees by department
            break;

        case "Delete Department":
            deleteDept ();// Function delete department
            break;

        case "Delete Role":
            deleteRole ();// Function delete role
                break;

        case "Delete Employee":
            deleteEmployee ();// Function delete employee
            break;

        case "View Total Utilized Budget of Deparment":
            viewBudget ();// Function View Budget            
            break;

        case "Finished!":
            process.exit();// Exits the App            
}
}

//Runs on init
newAction ();

///CASE 1 START
//Shows Departments and department id's
function viewDep () {

db.query(`SELECT department.name AS Department_Name, department.id AS Department_ID FROM department;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const table = cTable.getTable(result);
    console.log(table);
    newAction();
  })     
};
/// CASE 1 END

///CASE 2 START
//shows roles and role info
function viewRole () {

    db.query(
        `SELECT role.title AS Role_Title, role.id AS Role_ID, role.salary AS Salary, department.name AS Department_Name
         FROM role
         INNER JOIN department
         ON role.department_id = department.id;`, 
         (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
        newAction();
      })     
};
///CASE 2 END

///CASE 3 START
//Shows employess and employee info
function viewEmployee () {

        db.query(
                  `SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, employee.id AS Employee_ID, role.title AS Role_Title, role.salary AS Salary, department.name AS Department, manager.first_name AS Manager_First_Name,  manager.last_name AS Manager_Last_Name
                  FROM employee
                  INNER JOIN manager
                  ON employee.manager_id = manager.id
                  INNER JOIN role
                  ON  employee.role_id = role.id
                  INNER JOIN department
                  ON role.department_id = department.id;`,
                  (err, result) => {
            if (err) { 
              console.log(err);
            }
            const table = cTable.getTable(result);
            console.log(table);
            newAction();
          })     
};
///CASE 3 END

///CASE 4 START
//Adds new daprtment
function addDept () {

    db.query(
        `SELECT department.name AS Department_Name, department.id AS Department_ID FROM department;`, 
         (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
        inquirer.prompt(questionAddDept)
        .then(addDepartment)  
      })      
};

function addDepartment (questionAddDept) {

    let name = questionAddDept.name;
    addDeptActual (name);
}

function addDeptActual (name) {

    db.query(`INSERT INTO department (name)
              VALUES (?);`,
              name, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`${name} Added to Departments Succesfully!`);
        newAction();            
      })  
};

var questionAddDept = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the new Departments name?',
        validate: async (input) => {
            if ( (Number(input)) || input === '') {
                return 'You need to provide a name';
            }      
            return true;         
         }
    },
]
///CASE 4 END

///CASE 5 START
//Adds new Role
function addRole () {

    db.query(`SELECT role.title AS Role_Title, department.name AS Department, department.id AS Department_ID
              FROM role
              INNER JOIN department
              ON role.department_id = department.id;`, 
              (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);  
        inquirer.prompt(questionAddRole)
        .then(addRoleDefine) ;     
      })       
};

function addRoleDefine (questionAddRole) {

    let title = questionAddRole.title;
    let salary = questionAddRole.salary;
    let department_id = questionAddRole.department_id;
    addRoleActual (title, salary, department_id);
}

function addRoleActual (title, salary, department_id) {

    var queryStr = "INSERT INTO role (title, salary, department_id) VALUES ?";
    var values = [[title, salary, department_id]];

       db.query(queryStr, [values], (err, result) => {
        if (err) {
            console.log("Query go Boom");          
        }
        console.log(`${title} Added to Roles Succesfully!`);
        newAction();      
      })  
};

var questionAddRole = [
    {
        type: 'input',
        name: 'title',
        message: 'What is the new Roles Title?',
        validate: async (input) => {
            if ( (Number(input)) || input === '') {
                return 'You need to provide a name';
            }      
            return true;         
         }
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the Salary for the Role?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
    {
        type: 'input',
        name: 'department_id',
        message: 'What is the new Roles Departments ID?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 5 END

///CASE 6 START
//Adds new employee  
function addEmployee () {

    db.query(`SELECT department.name AS department, role.title AS title, role.id AS role_id, manager.id AS manager_id, manager.first_name AS Manager_First_Name, manager.last_name AS Manager_Last_Name
    FROM employee
    RIGHT JOIN manager
    ON employee.manager_id = manager.id
    INNER JOIN role
    ON  employee.role_id = role.id
    INNER JOIN department
    ON role.department_id = department.id;`, 
              (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);  
        inquirer.prompt(questionAddEmployee)
        .then(addEmployeeDefine) ;     
      })       
};

function addEmployeeDefine (questionAddEmployee) {

    let first_name = questionAddEmployee.first_name;
    let last_name = questionAddEmployee.last_name;
    let role_id = questionAddEmployee.role_id;
    let manager_id = questionAddEmployee.manager_id;
    addEmployeeActual (first_name, last_name, role_id, manager_id);

}

function addEmployeeActual (first_name, last_name, role_id, manager_id) {

    var queryStr = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?";
    var values = [[first_name, last_name, role_id, manager_id]];

       db.query(queryStr, [values], (err, result) => {
        if (err) {
            console.log("Query go Boom");
          
        }
        console.log(`${first_name} ${last_name} Added to Employees Succesfully!`);
        newAction(); 
      })  
};

var questionAddEmployee = [
    {
        type: 'input',
        name: 'first_name',
        message: 'What is the new employees first name?',
        validate: async (input) => {
            if ( (Number(input)) || input === '') {
                return 'You need to provide a name';
            }      
            return true;         
         }
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the new employees last name?',
        validate: async (input) => {
            if ( (Number(input)) || input === '') {
                return 'You need to provide a name';
            }      
            return true;         
         }
    },
    {
        type: 'input',
        name: 'role_id',
        message: 'What is the Role ID for the Employee?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
    {
        type: 'input',
        name: 'manager_id',
        message: 'What is the new Employees Manager ID?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 6 END

///CASE 7 START
//Update employees role
function updateRole() {

    db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_name, employee.id AS Employee_ID, employee.role_id AS Role_ID, role.title AS Role
    FROM employee
    INNER JOIN role
    ON employee.role_id = role.id;`,
         (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
        inquirer.prompt(questionUpdateRoleID)
        .then(updateRoleDefine);     
      })   
};  

function updateRoleDefine (questionUpdateRoleID) {

    let newRoleID = questionUpdateRoleID.newRoleID;
    let empID = questionUpdateRoleID.empID;
    updateRoleActual (newRoleID, empID);
}

function updateRoleActual(newRoleID, empID) {
    
    var queryStr = `UPDATE employee
                    SET employee.role_id = ?
                    WHERE employee.id = ?`;
    var values = [newRoleID, empID];

       db.query(queryStr, values, (err, result) => {    
        if (err) {
          console.log(err);
        }
        console.log(`Updated Role to ${newRoleID} for employee ${empID}`);
        newAction();
      }) 
      
};  

var questionUpdateRoleID = [
    {
        type: 'input',
        name: 'empID',
        message: 'What is the Employees id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
    {
        type: 'input',
        name: 'newRoleID',
        message: 'What is the New Role id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 7 END

///CASE 8 START
//Update employees manager
function updateMan() {

    db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_name, employee.id AS Employee_ID, employee.manager_id AS Manager_ID, manager.first_name AS Manager_First_Name, manager.last_name AS Manager_Last_Name
    FROM employee
    INNER JOIN manager
    ON employee.manager_id = manager.id;`,
         (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
        inquirer.prompt(questionUpdateManID)
        .then(updateManDefine);     
      })   
};  

function updateManDefine (questionUpdateManID) {

    let newManID = questionUpdateManID.newManID;
    let empID = questionUpdateManID.empID;
    updateManActual (newManID, empID);
}

function updateManActual(newManID, empID) {
    
    var queryStr = `UPDATE employee 
                    SET employee.manager_id =? 
                    WHERE employee.id =?`;
    var values = [newManID, empID];

       db.query(queryStr, values, (err, result) => {    
        if (err) {
          console.log(err);
        }
        console.log(`Updated Manager to ${newManID} for employee ${empID}`);
        newAction();
      }) 
      
};  

var questionUpdateManID = [
    {
        type: 'input',
        name: 'empID',
        message: 'What is the Employees id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
    {
        type: 'input',
        name: 'newManID',
        message: 'What is the New Managers id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 8 END

///CASE 9 START
//Shows manager names + IDs then asks for ID number
function viewEmpMan () {

    db.query(`SELECT manager.first_name AS First_Name, manager.last_name AS Last_Name, manager.id AS Manager_ID
              FROM manager`, 
        (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);  
        inquirer.prompt(questionManID)
        .then(empByMan);     
      })       
};

//Assigns the ID then runs the second function Async
function empByMan (questionManID) {

    let manID = questionManID.id;
    viewEmpByMan (manID);
}

//Returns the table
function viewEmpByMan (manID) {

    db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_name, employee.id AS Employee_ID, role.title AS Role_Title, department.name AS Department, role.salary AS Salary, employee.manager_id AS Manager_ID
    FROM employee
    INNER JOIN role
    ON employee.role_id = role.id
    INNER JOIN department
    ON role.department_id = department.id
    WHERE employee.manager_id = ?;`,
        manID, (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
        newAction();
      })   
};  

//Gets managers ID
var questionManID = [
    {
        type: 'input',
        name: 'id',
        message: 'What is the Managers id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
/// CASE 9 END

///CASE 10 START
//Function for viewing employees by department
function viewEmpDept () {

    db.query(`SELECT name AS Name, id AS ID FROM department`, (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);  
        inquirer.prompt(questionDeptID)
        .then(empByDept);     
      })       
};

//Assigns the ID then runs the second function Async
function empByDept (questionDeptID) {

    let DeptID = questionDeptID.id;
    viewEmpByDept (DeptID);
}

//Returns the table
function viewEmpByDept (manID) {

    db.query(`SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, employee.id AS Employee_ID, role.title AS Role_Title, department.name AS Department, role.salary AS Salary
              FROM employee
              INNER JOIN role
              ON employee.role_id = role.id
              INNER JOIN department
              ON role.department_id = department.id
              WHERE department.id = ?;`, manID, (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
        newAction();
      })   
};  

var questionDeptID = [
    {
        type: 'input',
        name: 'id',
        message: 'What is the Departments id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 10 END

///CASE 11 START
//Delete department
function deleteDept () {

    db.query(`SELECT department.name AS Department_Name, department.id AS Department_ID FROM department`, (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);  
        inquirer.prompt(questionDeleteDept)
        .then(deleteDeptDefine);     
      })       
};

//Assigns the ID then runs the second function Async
function deleteDeptDefine (questionDeleteDept) {

    let deptID = questionDeleteDept.id;
    deleteDeptActual (deptID);
}

//Returns the table
function deleteDeptActual (deptID) {

    db.query(`DELETE FROM department 
              WHERE department.id = ?;`, 
              deptID, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`${deptID} Removed from Departments`);
        newAction();
      })   
};  

var questionDeleteDept = [
    {
        type: 'input',
        name: 'id',
        message: 'What is the Departments id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 11 END

///CASE 12 START
//Delete role
function deleteRole () {

    db.query(`SELECT role.title AS Role_Title, department.name AS Department, role.id AS Role_ID
    FROM role
    INNER JOIN department
    ON role.department_id = department.id;`, (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);  
        inquirer.prompt(questionDeleteRole)
        .then(deleteRoleDefine);     
      })       
};

//Assigns the ID then runs the second function Async
function deleteRoleDefine (questionDeleteRole) {

    let roleID = questionDeleteRole.id;
    deleteRoleActual (roleID);
}

//Returns the table
function deleteRoleActual (roleID) {

    db.query(`DELETE FROM role 
              WHERE role.id = ?;`, 
              roleID, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`${roleID} Removed from Roles`);
        newAction();
      })   
};  

var questionDeleteRole = [
    {
        type: 'input',
        name: 'id',
        message: 'What is the Roles id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 12 END

///CASE 13 START
//Delete employee
function deleteEmployee () {

    db.query(`SELECT employee.first_name AS Employee_First_Name, employee.last_name AS Employee_Last_Name, employee.id AS Employee_ID FROM employee`, (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);  
        inquirer.prompt(questionDeleteEmployee)
        .then(deleteEmployeeDefine);     
      })       
};

//Assigns the ID then runs the second function Async
function deleteEmployeeDefine (questionDeleteEmployee) {

    let employeeID = questionDeleteEmployee.id;
    deleteEmployeeActual (employeeID);
}

//Returns the table
function deleteEmployeeActual (empID) {

    db.query(`DELETE FROM employee 
              WHERE employee.id = ?;`, 
              empID, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`${empID} Removed from Employees`);
        newAction();
      })   
};  

var questionDeleteEmployee = [
    {
        type: 'input',
        name: 'id',
        message: 'What is the Employee id?',
        validate: async (input) => {
            if ( !(Number(input)) || input === '') {
               return 'That is not a number, the ID should be a number';
            }      
            return true;         
         }
    },
]
///CASE 13 END

///CASE 14 START
//Shows budget of each department
function viewBudget () {

    db.query(`SELECT department.name AS Department_Name, 
              SUM(salary) AS Department_Total_Salary
              FROM employee
              INNER JOIN role
              ON employee.role_id = role.id
              INNER JOIN department
              ON role.department_id = department.id
              GROUP BY name;`,
              (err, result) => {
        if (err) {
          console.log(err);
        }
        const table = cTable.getTable(result);
        console.log(table);
        newAction();
      })    
};
///CASE 14 END
