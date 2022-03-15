CREATE TABLE IF NOT EXISTS employee(
    id int PRIMARY KEY,
    fname varchar(255) NOT NULL,
    lname varchar(255) NOT NULL,
    pass varchar(255) NOT NULL,
    admin boolean NOT NULL
);

CREATE ROLE non_admin;
CREATE ROLE admin;

INSERT INTO employee VALUES(10000, 'Edwardo', 'Nievecuna', 'falcon1', true);
CREATE USER u10000 WITH PASSWORD 'falcon1' IN ROLE non_admin;

INSERT INTO employee VALUES(15124, 'Annie', 'Crypto', 'NoMaidens', false);
CREATE USER u15124 WITH PASSWORD 'NoMaidens' IN ROLE non_admin;

INSERT INTO employee VALUES(24156, 'Bob', 'Blockchain', 'SK5000', false);
CREATE USER u24156 WITH PASSWORD 'SK5000' IN ROLE non_admin;
