DROP TABLE IF EXISTS `test_users`;

CREATE TABLE test_users (
    id int PRIMARY KEY,
    name varchar(255),
    email varchar(255) DEFAULT Null
);
INSERT INTO test_users (id, name, email)
VALUES
    (1, 'foo', 'foo@bar.com'),
    (2, 'foo2', 'foo2@bar.com'),
    (3, 'foo3', 'foo3@bar.com');