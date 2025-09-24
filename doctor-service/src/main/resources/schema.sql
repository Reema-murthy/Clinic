CREATE DATABASE IF NOT EXISTS clinic;

USE clinic;

CREATE TABLE IF NOT EXISTS doctors (
  id INT(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  INDEX(last_name)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS specialties (
  id INT(4) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80),
  INDEX(name)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS doctor_specialties (
  doctor_id INT(4) UNSIGNED NOT NULL,
  specialty_id INT(4) UNSIGNED NOT NULL,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (specialty_id) REFERENCES specialties(id),
  UNIQUE (doctor_id,specialty_id)
) engine=InnoDB;
