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
  VALUES (?);

/*Add to Role*/
INSERT INTO role (title, salary, department_id)
  VALUES ("builder", 45000, 3);

/*Add to Employee*/
INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?, ?, ?, ?);

/*Update Employee Role*/
UPDATE employee
SET employee.role_id = ?
WHERE employee.id = ?

/*Update Employee Managers*/
UPDATE employee
SET employee.manager_id = ?
WHERE employee.id = ?

/*View Employees by Manager*/
SELECT * FROM employees WHERE employee.manager_id = ?

/*View Employees by Department*/
SELECT employee.first_name AS first_name, employee.last_name AS last_name, employee.id AS employee_id, role.title AS title, department.name AS department, role.salary AS salary
FROM employee
INNER JOIN role
ON  employee.role_id = role.id
INNER JOIN department
ON role.department_id = department.id
WHERE department.id = ?;

/*Delete Department*/
DELETE FROM department 
WHERE department.id = ?;

/*Delete Role*/
DELETE FROM role 
WHERE role.id = ?;

/*Delete Employee*/
DELETE FROM employee 
WHERE employee.id = ?;

/*View Utilization by Department*/
SELECT department.name, SUM(salary) AS Department_Total_Salary
FROM department
INNER JOIN role
ON  department.id = role.department_id
GROUP BY name;