-- Run this script in MySQL Workbench.
CREATE DATABASE IF NOT EXISTS school;
USE school;

CREATE TABLE IF NOT EXISTS `event` (
  EventID INT NOT NULL AUTO_INCREMENT,
  EventName VARCHAR(150) NOT NULL,
  Type VARCHAR(80) NOT NULL,
  `Date` DATE NOT NULL,
  Venue VARCHAR(180) NOT NULL,
  Description TEXT,
  Photos LONGTEXT,
  PRIMARY KEY (EventID)
);
