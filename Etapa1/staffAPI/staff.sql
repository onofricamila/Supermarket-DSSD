DROP DATABASE IF EXISTS staff;
CREATE DATABASE staff;

\c staff;

CREATE TABLE employeeTypes (
  id SERIAL NOT NULL PRIMARY KEY,
  initials VARCHAR(5) NOT NULL,
  description VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
  ID SERIAL NOT NULL PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  employeetype INT NOT NULL REFERENCES employeeTypes (id)
);

INSERT INTO employeeTypes (initials, description)
  VALUES ('ca', 'cajero');

INSERT INTO employees (firstname, surname, email, password, employeetype)
  VALUES ('Juan', 'Perez', 'juanperez@gmail.com', 'juanperez123', 1);
