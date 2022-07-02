INSERT INTO department (name)
VALUES 
("Human Resources"),
("Purchasing"),
("Sales");


INSERT INTO roles (title, salary, department_id)
VALUES
("Hr Rep", 50000, 1),
("Salesperson", 40000, 2),
("Customer Representative", 30000, 3),
("Buyer", 65000.00, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Todd", "Howard", 1, NULL),
("Ron", "Burgundy", 1, 1),
("Humpty", "Dumpty", 1, 1),
("Samuel", "Jackson", 1, 1),
("Veronic", "Corningstone", 1, 1),
("Robin", "Shirbotski", 1, 1),
("Ben", "Franklin", 1, 1),
("Florence", "Nightengale", 1, 1),
("Abbey", "Road", 1, 1),
("Mike", "Tyson", 1, 1);