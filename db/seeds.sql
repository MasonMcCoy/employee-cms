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
("Ron", "Burgundy", 2, 1),
("Humpty", "Dumpty", 3, 7),
("Samuel", "Jackson", 4, NULL),
("Veronic", "Corningstone", 2, 1),
("Robin", "Shirbotski", 3, 7),
("Ben", "Franklin", 3, NULL),
("Florence", "Nightengale", 3, 7),
("Abbey", "Road", 4, 4),
("Mike", "Tyson", 3, 7);