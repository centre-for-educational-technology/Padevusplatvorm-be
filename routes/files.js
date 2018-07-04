const express = require('express');
const router = express.Router();
const request = require('request');
const cache = require('../cache/cache');

router.get('/image/:id', function (req, res) {
	try {
		if(req.params.id){
			const cached = cache.getItem(req.params.id);
			if (cached){
				let image = cache.getItem(req.params.id + '_image');
				if (image){
					res.writeHead(200, image.headers);
					res.end(new Buffer(image.data, 'binary'));
				} else {
					request.get({url: cached.image, encoding: 'binary'}, (error, response) => {
						image = {
							id: req.params.id + '_image',
							headers: response.headers,
							data: response.body
						};
						res.writeHead(200, image.headers);
						res.end(new Buffer(image.data, 'binary'));
						cache.saveCache([image]);
					});
				}
			} else {
				res.statusCode = 404;
				res.send(null);
			}
		} else {
			res.statusCode = 404;
			res.send(null);
		}
	} catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

module.exports = router;