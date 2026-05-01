const mysql = require('mysql2');

const pool = mysql.createPool ({
    host: 'localhost',
    user: 'root',
    password: 'Sethu@2006',
    database: 'codveda_auth'
});

module.exports = pool.promise();