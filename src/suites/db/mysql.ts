import mysql from "mysql";

const connection = mysql.createConnection({
    port: 13306,
    host: "server.local",
    user: "root",
    password: "404363289",
});

const DB_NAME = "testDB_" + new Date().getTime().toString();

connection.query(`CREATE DATABASE ${DB_NAME};`, (error, results, fields) => {
    if (error) throw error;
});

connection.query(`USE ${DB_NAME};`, (error, results, fields) => {
    if (error) throw error;
});

connection.query(
    ` 
    CREATE TABLE User (
        name VARCHAR(30)  NOT NULL,
        age INT(6) UNSIGNED NOT NULL
    );`,
    (error, results, fields) => {
        if (error) throw error;
    },
);

connection.query("CREATE INDEX age_index ON User (age);", (error, results, fields) => {
    if (error) throw error;
});

connection.query("CREATE INDEX name_index ON User (name);", (error, results, fields) => {
    if (error) throw error;
});

export default connection;
