const db = require('../database/data');
const md5 = require('md5');
const restModel = require('../rest/restModel');
const uuidv1 = require('uuid/v1');

function validateUser(request, response, callback) {
	if (request.headers['api-key']) {
		db.query('SELECT user.* FROM user_session session ' +
			'INNER JOIN user AS user ON user.id = session.fk_user ' +
			'WHERE session.token = ?', [request.headers['api-key']], rows => {
			if (rows.length > 0){
				callback(rows[0]);
			} else {
				restModel.generateResponse(base => {
					base.userMessage = 'Need to be logged in to use this endpoint.';
					response.statusCode = 401;
					response.send(base);
				});
			}
		}, error => {
			console.log(error);
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

function getUser(email, password, callback, failure = error => {
	console.log(error)
}) {
	console.log(email);
	console.log(password);
	db.query("SELECT * FROM user WHERE email = ?", [email.toLowerCase()], rows => {
		rows.length && password === rows[0].password ? callback(rows[0]) : callback(null)
	}, error => {
		failure(error);
	});
}

function addUserSession(user, callback, failure){
	const token = uuidv1();
	db.query("INSERT INTO user_session (fk_user, token) VALUES (?, ?)", [user.id, token],()=>{
		callback(token);
	}, error =>{
		failure(error);
	});
}

module.exports = {
	getUser,
	validateUser,
	addUserSession
};