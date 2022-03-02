const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: '', //ADD THIS IN//
      database: 'employee_db'
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
                  "Delete Departments, Roles or Employees",
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
            addRole ();           
            break;

        case "Add an Employee":
            addEmployee (); 
            break;
            
        case "Update an Employee Role":
            inquirer.prompt(questionsEmployeeRole)
            .then(createEngineer)
            .then(newTeamMember)
            break;

        case "Update Employee Managers":
            inquirer.prompt(questionsEmployeeManager)
            .then(createIntern)
            .then(newTeamMember)
            break;

        case "View Employees by Manager":
            viewEmpMan ();// Function view employees by manager
            break;

        case "View Employees by Department":
            viewEmpDept ();// Function view employees by department
            break;

        case "Delete Departments, Roles or Employees":
            inquirer.prompt(questionsDelete)
            .then(createIntern)
            .then(newTeamMember)
            break;

        case "View Total Utilized Budget of Deparment":
            viewBudget ();// Function View Budget            
            break;

        case "Finished!":
           
            break;
}
}

newAction ();
//Write SQL QUERIES -- DONE
//DISPLAY QUERY RESULTS IN INQUIRER
//CREATE FUNCTIONS THAT UTILISE SQL QUIERIES -- HERE


///CASE 1 START
//Shows Departments and department id's
function viewDep () {
db.query(`SELECT * FROM department;`, (err, result) => {
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
        `SELECT role.title AS title, role.id AS role_id, role.salary AS salary, department.name AS department
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
        db.query(`SELECT employee.first_name AS first_name, employee.last_name AS last_name, employee.id AS employee_id, role.title AS title, role.salary AS salary, department.name AS department, manager.first_name AS manager
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
            newAction();
          })     
};
///CASE 3 END

///CASE 4 START
//Adds new daprtment
function addDept () {

    db.query(
        `SELECT department.id AS department_id, department.name AS department
         FROM role
         INNER JOIN department
         ON role.department_id = department.id;`, 
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
        console.log(`${deptName} Added to Departments Succesfully!`);
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

    db.query(`SELECT department.id AS department_id, department.name AS department, role.title AS title, role.id AS role_id
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
//Adds new employee  -- NEED MANAGER AND ROLE INFO IN INITIAL POP UP
function addEmployee () {

    db.query(`SELECT department.id AS department_id, department.name AS department, role.title AS title, role.id AS role_id
              FROM role
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
///CASE 7 END

///CASE 8 START
//Update employees manager
///CASE 8 END

///CASE 9 START
//Shows manager names + IDs then asks for ID number
function viewEmpMan () {

    db.query(`SELECT * FROM manager`, (err, result) => {
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
    db.query(`SELECT * FROM employee WHERE employee.manager_id = ?`, manID, (err, result) => {
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

    db.query(`SELECT * FROM department`, (err, result) => {
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

    let manID = questionDeptID.id;
    viewEmpByMan (manID);

}

//Returns the table
function viewEmpByMan (manID) {
    db.query(`SELECT employee.first_name AS first_name, employee.last_name AS last_name, employee.id AS employee_id, role.title AS title, department.name AS department, role.salary AS salary
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
///CASE 11 END

///CASE 12 START
//Delete role
///CASE 12 END

///CASE 13 START
//Delete employee
///CASE 13 END

///CASE 14 START
//Shows budget of each department
function viewBudget () {

    db.query(`SELECT department.name, 
              SUM(salary) AS Department_Total_Salary
              FROM department
              INNER JOIN role
              ON department.id = role.department_id
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
