const express = require('express');
const router = express.Router();
const users = require('../auth/users');
const restModel = require('../rest/restModel');

/**
 * Login user.
 */
router.post('/login', (req, res) => {
	try {
        validateLogin(req, res, () => {
            users.getUser(req.body.email, req.body.password, user => {
                    if (user) {
                        users.addUserSession(user, token => {
                            restModel.generateResponse(base => {
                                delete user.password;
                                user.token = token;
                                base.data = user;
                                base.userMessage = 'User logged in.';
                                res.send(base);
                            });
                        }, error => {
                            restModel.generateErrorResponse(base=>{
                                res.statusCode = 500;
                                res.send(base);
                            })
                        });
                    } else {
                        restModel.generateResponse(base => {
                            base.userMessage = 'Wrong username or password provided.';
                            res.statusCode = 400;
                            res.send(base);
                        });
                    }
                },
                error => {
                    restModel.generateResponse(base => {
                        base.error = error.message;
                        base.userMessage = 'Unable to login. If this error persists please contact the adminstrator.';
                        res.statusCode = 500;
                        res.send(base);
                    });
                });
        });
	} catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.post('/logout', (req, res) => {
	try {
        if (req.session.user) {
            delete req.session.user;
            restModel.generateResponse(base => {
                base.userMessage = 'Logged out.';
                res.send(base);
            });
        } else {
            restModel.generateResponse(base => {
                base.userMessage = 'Not logged in.';
                res.statusCode = 400;
                res.send(base);
            });
        }
	} catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

function validateLogin(req, res, cb){
	if (!req.body.email || !req.body.password) {
		restModel.generateResponse(base => {
			base.userMessage = 'Missing username or password.';
			res.statusCode = 400;
			res.send(base);
		});
		return 0;
	}
	cb();
}

module.exports = router;
