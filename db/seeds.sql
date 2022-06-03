
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ruckus', 'Chuckus', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Zoey', 'Doey', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('MewMew', 'MaChew', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Domino', 'Bomino', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jess', 'Thes', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ricky', 'Bobby', 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Cloudster', 'Garage', 6, null);

INSERT INTO department (department_name)
VALUES ('Management');
INSERT INTO department (department_name)
VALUES ('Sales');
INSERT INTO department (department_name)
VALUES ('Public Relations');
INSERT INTO department (department_name)
VALUES ('Administration');
INSERT INTO department (department_name)
VALUES ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES ('General Manager', 120000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Saleslady', 90000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Brand Consultant', 70000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Receptionist', 40500, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Human Resource Lead', 65000, 5);
INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 250000, null);
