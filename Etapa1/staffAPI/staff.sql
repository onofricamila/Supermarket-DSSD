--DDL
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

-- User
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT                       
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'grupo1') THEN

      CREATE ROLE grupo1 LOGIN PASSWORD 'topsecret';
   END IF;
END
$do$;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO grupo1;
GRANT ALL PRIVILEGES ON TABLE employees TO grupo1;
GRANT ALL PRIVILEGES ON TABLE employeeTypes TO grupo1;

-- DML
INSERT INTO employeeTypes (initials, description)
  VALUES ('ca', 'cajero'), ('ge', 'gerente'), ('po', 'portero');

INSERT INTO employees (firstname, surname, email, password, employeetype) VALUES 
  ('Juan', 'Perez', 'juanperez@gmail.com', 'juanperez123', 1),
  ('Pedro', 'Perez', 'pedroperez@gmail.com', 'pedroperez123', 1),
  ('Jose', 'Gallardo', 'josegallardo@gmail.com', 'josegallardo123', 2),
  ('Manuel', 'Arias', 'manuelarias@gmail.com', 'manuelarias123', 2),
  ('Andres', 'Carmona', 'andrescarmona@gmail.com', 'andrescarmona123', 3),
  ('Julia', 'Vargas', 'juliavargas@gmail.com', 'juliavargas123', 1),
  ('Daniela', 'Mora', 'danielamora@gmail.com', 'danielamora123', 2),
  ('Marta', 'Sanchez', 'martasanchez@gmail.com', 'martasanchez123', 3),
  ('Cristina', 'Moya', 'cristinamoya@gmail.com', 'cristinamoya123', 3);
