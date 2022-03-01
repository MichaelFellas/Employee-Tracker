const inquirer = require("inquirer");
const mysql = require("mysql2");

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
            showDepartments();// Function get all departments            
            break;

        case "View all Roles":
            showRoles();// Function get all roles            
            break;

        case "View all Employees":
            showEmployees();// Function get all employees            
            break;
            
        case "Add a Department":
            inquirer.prompt(questionsDepartment)
            .then(createDepartment)            
            break;

        case "Add a Role":
            inquirer.prompt(questionsRole)
            .then(createRole)            
            break;

        case "Add an Employee":
            inquirer.prompt(questionsEmployee)
            .then(createEmployee)  
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
            inquirer.prompt(questionsViewEmployeeManager)
            .then(createIntern)
            .then(newTeamMember)
            break;

        case "View Employees by Department":
            inquirer.prompt(questionsViewEmployeeDepartment)
            .then(createEngineer)
            .then(newTeamMember)
            break;

        case "Delete Departments, Roles or Employees":
            inquirer.prompt(questionsDelete)
            .then(createIntern)
            .then(newTeamMember)
            break;

        case "View Total Utilized Budget of Deparment":
            inquirer.prompt(questionsBudget)
            .then(newTeamMember)
            break;

        case "Finished!":
            generateHTMLfunc ();
            break;
}
}

//Write SQL QUERIES -- DONE
//DISPLAY QUERY RESULTS IN INQUIRER
//CREATE FUNCTIONS THAT UTILISE SQL QUIERIES -- HERE