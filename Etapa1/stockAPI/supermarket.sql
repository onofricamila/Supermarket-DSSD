DROP DATABASE IF EXISTS supermarket;
CREATE DATABASE supermarket;

\c supermarket;

CREATE TABLE productTypes (
  id SERIAL NOT NULL PRIMARY KEY,
  initials VARCHAR(5) NOT NULL,
  description VARCHAR(100) NOT NULL
);


CREATE TABLE products (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  costprice INT NOT NULL,
  saleprice INT NOT NULL,
  producttype INT NOT NULL REFERENCES productTypes (id)
);


INSERT INTO productTypes (initials, description)
  VALUES ('gt', 'galletitas');

INSERT INTO products (name, costPrice, salePrice, productType)
  VALUES ('toddys', 5, 10, 1);


