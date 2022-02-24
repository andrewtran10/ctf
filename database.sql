CREATE DATABASE ctf;

CREATE TABLE employee(
    empl_id int PRIMARY KEY,
    fname varchar(255) NOT NULL,
    lname varchar(255) NOT NULL,
    pass varchar(255) NOT NULL,
    admin boolean NOT NULL
);

INSERT INTO employee VALUES(1, 'andrew', 'tran', 'password', true);

CREATE USER andrew WITH PASSWORD 'password';

CREATE role non_admin
CREATE role admin