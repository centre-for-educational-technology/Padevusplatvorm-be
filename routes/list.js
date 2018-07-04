const express = require('express');
const router = express.Router();
const restModel = require('../rest/restModel');
const list = require('../list/webLinks');
const users = require('../auth/users');

/* GET list. */
router.get('/', function (req, res) {
	try {
        const queryLimit = req.query.limit;
        const queryOffset = req.query.offset;
        const limit = isNaN(queryLimit) ? 20 : parseInt(queryLimit);
        const offset = isNaN(queryOffset) ? 20 : parseInt(queryOffset);
        list.getList(limit, offset, data => {
            data = data.sort((item1, item2) => item2.id - item1.id);
            restModel.generateResponse(base => {
                base.data = data;
                res.send(base);
            });
        }, error => {
            restModel.generateErrorResponse(base => {
                res.statusCode = 500;
                base.error = error.message;
                res.send(base);
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

router.get('/admin', (req, res) => {
	try {
        users.validateUser(req, res, () => {
            const queryLimit = req.query.limit;
            const queryOffset = req.query.offset;
            const limit = isNaN(queryLimit) ? 20 : parseInt(queryLimit);
            const offset = isNaN(queryOffset) ? 20 : parseInt(queryOffset);
            list.getAdminList(limit, offset, data => {
                data = data.sort((item1, item2) => item2.id - item1.id);
                restModel.generateResponse(base => {
                    base.data = data;
                    res.send(base);
                });
            }, error => {
                restModel.generateErrorResponse(base => {
                    res.statusCode = 500;
                    base.error = error.message;
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

router.post('/add', function (req, res) {
	try {
		users.validateUser(req, res, user => {
			if (req.body.hasOwnProperty('link')){
				list.verifyLink(req, res, req.body.link, () => {
					list.addWebLink(user, req.body.link, () => {
						restModel.generateResponse(base => {
							base.userMessage = 'Link added.';
							res.send(base);
						});
					}, error => {
						restModel.generateErrorResponse(base => {
							res.statusCode = 500;
							base.error = error.message;
							res.send(base);
						});
					});
				});
			} else {
				restModel.generateResponse(base => {
					res.statusCode = 400;
					base.userMessage = 'Link not provided.';
					res.send(base);
				});
			}
		});
	} catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.delete('/remove/:linkId', function (req, res) {
	try {
		users.validateUser(req, res, user => {
			list.removeWebLink(user, req.params.linkId, () => {
				restModel.generateResponse(base => {
					base.userMessage = 'Link removed.';
					res.send(base);
				});
			}, error => {
				restModel.generateErrorResponse(base => {
					res.statusCode = 500;
					base.error = error.message;
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

router.get('/check', (req, res) => {
	try {
		users.validateUser(req, res, () => {
			if (req.query.hasOwnProperty('link') && req.query.link.length > 0){
				list.verifyLink(req, res, req.query.link, () => {
					list.getWebLinkData(req.query.link, data => {
						res.send(data);
					}, error => {
						restModel.generateErrorResponse(base => {
							res.statusCode = 500;
							base.error = error.message;
							res.send(base);
						});
					});
				});
			} else {
				restModel.generateResponse(base => {
					res.statusCode = 400;
					base.userMessage = 'Link not provided.';
					res.send(base);
				});
			}
		});
	} catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.get('/article-count', (req, res) => {
	try {
		list.getArticleCount(count => {
			restModel.generateResponse(base => {
				base.data = count;
				res.send(base);
			});
		}, error => {
			restModel.generateErrorResponse(base => {
				res.statusCode = 500;
				base.userMessage = 'Something went wrong. Please try again.';
				res.send(base);
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


module.exports = router;
