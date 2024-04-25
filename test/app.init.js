const mysql = require('mysql2');
const fs = require('fs');
require('../src/database')();

const initTestDB = () => {
    useTestDB(true);

    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_TEST_DATABASE,
        multipleStatements: true
    }).promise();

    const lines = fs.readFileSync('testSchema.sql').toString();

    return pool.query(lines);
};

module.exports = {
    initTestDB: initTestDB
};