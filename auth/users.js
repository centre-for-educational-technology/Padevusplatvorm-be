const db = require('../database/data');
const restModel = require('../rest/restModel');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const crypto = require('crypto');

function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

function saltHashPassword(password) {
    const salt = getRandomString(16);
    return sha512(password, salt);
}

function addUser(user, success, failure) {
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    const hashedPassword = saltHashPassword(user.password);
    db.query("INSERT INTO user (email, password, salt, date_created) VALUES (?, ?, ?, ?)",
        [user.email, hashedPassword.passwordHash, hashedPassword.salt, utc],
        addedUser => {
            success(addedUser);
        }, failure);
}

function validateUser(request, response, callback) {
    if (request.headers['api-key']) {
        db.query('SELECT user.* FROM user_session session ' +
            'INNER JOIN user AS user ON user.id = session.fk_user ' +
            'WHERE session.token = ?', [request.headers['api-key']], rows => {
            if (rows.length > 0) {
                callback(rows[0]);
            } else {
                restModel.generateResponse(base => {
                    base.userMessage = 'Need to be logged in to use this endpoint.';
                    response.statusCode = 401;
                    response.send(base);
                });
            }
        }, error => {
            restModel.generateErrorResponse(base => {
                response.statusCode = 500;
                response.error = error.message;
                response.send(base);
            });
        });
    } else {
        restModel.generateResponse(base => {
            base.userMessage = 'Need to be logged in to use this endpoint.';
            response.statusCode = 401;
            response.send(base);
        });
    }
}

function getUser(email, password, success, failure = error => {
}) {
    db.query("SELECT * FROM user WHERE email = ?", [email.toLowerCase()], rows => {
        if (rows.length) {
            const user = rows[0];
            const hashedPassword = sha512(password, user.salt);
            if (hashedPassword.passwordHash === user.password) {
                success(user);
            } else {
                failure(null);
            }
        } else {
            failure(null);
        }
    }, error => {
        failure(error);
    });
}

function addUserSession(user, callback, failure) {
    const token = uuidv1();
    db.query("INSERT INTO user_session (fk_user, token) VALUES (?, ?)", [user.id, token], () => {
        callback(token);
    }, error => {
        failure(error);
    });
}

module.exports = {
    getUser,
    validateUser,
    addUserSession,
    addUser
};