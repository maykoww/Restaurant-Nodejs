const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.APP_DB_HOST,
    user: process.env.APP_DB_USER,
    database: process.env.APP_DB_NAME,
    multipleStatements: true
});

module.exports = connection;