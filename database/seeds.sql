INSERT INTO department (name)
VALUES ("Sales"),
       ("Boss"),
       ("Tech"),
       ("General");

INSERT INTO role (title, salary, department_id)
VALUES ("Intern", 65000, 3),
       ("Engineer", 80000, 3),
       ("Salesman", 70000, 1),
       ("CEO", 400000, 2),
       ("Cleaner", 40000, 4),
       ("Reception", 50000, 4),
       ("IT", 65000, 3);

INSERT INTO manager (id, first_name, last_name, role_id)
VALUES (1,"Michael","Ariti",4),
       (4,"Adam","Locks",3),
       (2,"Daniel","Cardoso",1),
       (3,"Celeste","Patricio",2),
       (5,"Monty","Moww",5),
       (6,"Jodie","Sosa",6),
       (7,"Sam","Dwight",7);
       

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Isobel","Fawcett", 1, 2),
       ("Gina","Cardoso", 1, 2),
       ("Josh","Patricio", 1, 2),
       ("Daniel","Cardoso", 1, 1),
       ("Sandra","Carvalho", 2, 3),
       ("Steve","Carvalho", 2, 3),
       ("Lucas","Merau", 2, 3),
       ("Celeste","Patricio", 2, 1),
       ("Andrew","Smith", 3, 4),
       ("Luke","Neale", 3, 4),
       ("Matt","Dent", 3, 4),
       ("Adam","Locks", 3, 1),
       ("Rob","Rousset", 5, 5),
       ("Joseph","Munawar", 5, 5),
       ("David","Carvalho", 5, 5),
       ("Monty","Moww", 5, 1),
       ("Chaos","Boxer", 6, 6),
       ("Roguey","Boxer", 6, 6),
       ("Chris","Mcleod", 6, 6),
       ("Jodie","Sosa", 6, 1),
       ("Shaun","Warren", 7, 7),
       ("Kiah","Hunter", 7, 7),
       ("Josh","Mazz", 7, 7),
       ("Sam","Dwight", 7, 1),
       ("Michael","Ariti", 4, NULL);
       




       
