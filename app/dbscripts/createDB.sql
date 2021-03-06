CREATE DATABASE IF NOT EXISTS jdhomepage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jdhomepage;

CREATE USER IF NOT EXISTS 'connectBot'@'%' IDENTIFIED BY 'MkAE5ZTLyWxHPXQBHv63bVaopdFEk0x7';
GRANT SELECT, INSERT ON jdhomepage.* TO connectBot@localhost IDENTIFIED BY 'MkAE5ZTLyWxHPXQBHv63bVaopdFEk0x7';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS visits (
  visitID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  clientIP VARCHAR(128) NULL,
  clientProxy VARCHAR(128) NULL,
  visitTime TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS contactRequests (
  requestID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  requestName VARCHAR(512) NULL,
  requestBody VARCHAR(MAX) NULL,
  requestTime TIMESTAMP NOT NULL
);
