-- Db
DROP DATABASE IF EXISTS stock;
CREATE DATABASE stock;
\c stock;

-- DDL
CREATE TABLE productTypes (
  id SERIAL NOT NULL PRIMARY KEY,
  initials VARCHAR(5) NOT NULL,
  description VARCHAR(100) NOT NULL
);

CREATE TABLE products (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  costPrice INT NOT NULL,
  salePrice INT NOT NULL,
  productType INT NOT NULL REFERENCES productTypes (id)
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
GRANT ALL PRIVILEGES ON TABLE products TO grupo1;
GRANT ALL PRIVILEGES ON TABLE productTypes TO grupo1;

-- DML
INSERT INTO productTypes (initials, description)
  VALUES ('gtt', 'galletitas'),
         ('bbd', 'bebidas'),
         ('cnd', 'condimentos'),
         ('jug', 'jugos'),
         ('snk', 'snacks'),
         ('elc', 'electro');

INSERT INTO products (name, costPrice, salePrice, productType)
  VALUES ('toddy', 10, 10, 1),
         ('oreo', 5, 10, 1),
         ('opera', 3, 10, 1),
         ('cheetos', 5, 15, 5),
         ('doritos', 5, 15, 5),
         ('tv', 5, 20, 6),
         ('monitor', 5, 20, 6);


