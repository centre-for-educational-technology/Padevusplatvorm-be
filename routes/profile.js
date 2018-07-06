const express = require('express');
const router = express.Router();
const restModel = require('../rest/restModel');
const profile = require('../profile/profile');

router.get('/', function (req, res) {
    try {
        profile.getAllProfiles(data => {
            restModel.generateResponse(base => {
                base.data = data;
                base.userMessage = 'Retrieved all profiles.';
                res.send(base);
            });
        }, error => {
            restModel.generateErrorResponse(base => {
                res.statusCode = 500;
                base.error = error.message;
                res.send(base);
            })
        });
    } catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.get('/:userId', function (req, res) {
    try {
        const userId = req.params.userId;
        profile.getProfile(userId, retrievedProfile => {
            restModel.generateResponse(base => {
                if (retrievedProfile) {
                    base.data = retrievedProfile;
                    base.userMessage = 'Retrieved profile.';
                } else {
                    base.userMessage = 'Profile does not exist.';
                }
                res.send(base);
            });
        }, error => {
            restModel.generateErrorResponse(base => {
                res.statusCode = 500;
                base.error = error.message;
                res.send(base);
            })
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
    const profileToAdd = req.body.profile;
    try {
        profile.addProfile(profileToAdd, addedProfile => {
            restModel.generateResponse(base => {
                base.userMessage = 'Profile added.';
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

module.exports = router;
