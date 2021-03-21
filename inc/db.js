const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.APP_DB_HOST,
    user: process.env.APP_DB_USER,
    password: process.env.APP_DB_PASS,
    database: process.env.APP_DB_NAME,
    multipleStatements: true
});

module.exports = connection;