CREATE DATABASE ctf;

CREATE TABLE employee(
    empl_id int PRIMARY KEY,
    fname text NOT NULL,
    lname text NOT NULL,
    pass text NOT NULL,
    admin boolean NOT NULL
);

INSERT INTO employee VALUES(
    1, 'andrew', 'tran', 'password', true
)