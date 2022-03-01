 /*View ALL DEPARTMENTS*/
SELECT * FROM department;

/*View ALL Roles*/
SELECT role.title AS title, role.id AS role_id, role.salary AS salary, department.name AS department
FROM role
INNER JOIN department
ON role.department_id = department.id;

/*View aLL Employees*/
SELECT employee.first_name AS first_name, employee.last_name AS last_name, employee.id AS employee_id, role.title AS title, role.salary AS salary, department.name AS department, employee.manager_id AS manager
FROM employee
RIGHT JOIN manager
ON employee.manager_id = manager.id
INNER JOIN role
ON  employee.role_id = role.id
INNER JOIN department
ON role.department_id = department.id;

/*ADD to Department*/
INSERT INTO department (name)
  VALUES ("Drivers");

/*Add to Role*/
INSERT INTO role (title, salary, department_id)
  VALUES ("Driver", 50000, 5);

/*Add to Employee*/
INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES ("Big", "Dyl", 8, 2);

/*Update Employee Role*/

/*Update Employee Managers*/

/*View Employees by Manager*/

/*View Employees by Department*/

/*Delete Department*/

/*Delete Role*/

/*Delete Employee*/

/*View Utilization by Department*/
SELECT department.name, SUM(salary) AS Department_Total_Salary
FROM department
INNER JOIN role
ON  department.id = role.department_id
GROUP BY name;