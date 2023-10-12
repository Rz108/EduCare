const mysql = require('mysql');
var dbconnect = {
    getConnection: () => {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "tryhack1",
            password: "111222333",
            database: "tryhack"
        });
        return conn;
    }
};
module.exports = dbconnect;