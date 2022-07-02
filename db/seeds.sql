INSERT INTO department (name)
VALUES 
("Human Resources"),
("Purchasing"),
("Sales"),
("IT");


INSERT INTO roles (title, salary, department_id)
VALUES
("Hr Rep", 50000, 1),
("Salesperson", 40000, 2),
("Customer Representative", 30000, 3),
("Help Desk Specialist", 65000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Todd", "Howard", 1, NULL),
("Ron", "Burgundy", 1, 1),
("Humpty", "Dumpty", 1, 1),
("Samuel", "Jackson", 2, NULL),
("Veronic", "Corningstone", 2, 4),
("Robin", "Shirbotski", 2, 4),
("Ben", "Franklin", 3, NULL),
("Florence", "Nightengale", 3, 7),
("Abbey", "Road", 4, NULL),
("Mike", "Tyson", 4, 9);