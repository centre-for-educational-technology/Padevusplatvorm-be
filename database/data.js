const mysql = require('mysql');

const databaseConfig = {
    host: 'localhost',
    user: 'ddcmp',
    password: 'jamamaja',
    database: 'ddcmp',
    connectionLimit: 15,
    timezone: 'Z'
};

if (process.env.environment === 'dev'){
    databaseConfig.user = 'root';
    databaseConfig.password = '';
}

const connectionPool = mysql.createPool(databaseConfig);

function query(sql, values = [], success, error) {
    connectionPool.query(sql, values, function (err, rows, fields) {
        if (!err) {
            success(rows, fields);
        }
        else {
            if (error !== undefined) {
                console.log(err);
                error(err);
            } else {
                console.log("Unhandled database error - " + err);
            }
        }
    });
}

module.exports = {
    query: query
};