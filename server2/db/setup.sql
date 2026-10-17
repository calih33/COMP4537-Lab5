--  Creates the database
CREATE DATABASE IF NOT EXISTS lab5;

CREATE TABLE IF NOT EXISTS lab5.patient (
    patientid INT(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (patientid),
    name VARCHAR(100) NOT NULL,
    dateOfBirth DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE USER IF NOT EXISTS 'lab5_writer'@'localhost' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS 'lab5_reader'@'localhost' IDENTIFIED BY 'password';

REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'lab5_writer'@'localhost';
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'lab5_reader'@'localhost';

GRANT CREATE, INSERT ON lab5.* TO 'lab5_writer'@'localhost';
GRANT SELECT ON lab5.* TO 'lab5_reader'@'localhost';

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'lab5_writer'@'localhost';
SHOW GRANTS FOR 'lab5_reader'@'localhost';