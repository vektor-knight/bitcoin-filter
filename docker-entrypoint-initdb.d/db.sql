CREATE DATABASE IF NOT EXISTS krakendb;
CREATE USER IF NOT EXISTS'krakenAdmin'@'%' IDENTIFIED BY 'krakenAdmin';
GRANT ALL PRIVILEGES ON *.* TO 'krakenAdmin'@'%';

USE krakendb;

CREATE TABLE IF NOT EXISTS customer (name VARCHAR(69), address VARCHAR(69), PRIMARY KEY (address));
CREATE TABLE IF NOT EXISTS deposit (address VARCHAR(53), amount FLOAT, confirmations INT, txID VARCHAR(255), PRIMARY KEY (txID));
INSERT IGNORE INTO customer (name, address) VALUES ("Wesley Crusher", "mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ") , ("Leonard McCoy", "mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp"), ("Jonathan Archer", "mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n"), ("Jadzia Dax", "2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo"), ("Montgomery Scott", "mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8"), ("James T. Kirk", "miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM"), ("Spock", "mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV");
