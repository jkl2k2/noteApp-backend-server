const app = require('../src/app');
const mysql = require('mysql2');
const fs = require('fs');

const initTestDB = () => {
    app.enableTesting();

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