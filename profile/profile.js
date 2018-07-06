const db = require('../database/data');
const moment = require('moment');

function getAllProfiles(success, failure) {
    db.query('SELECT * FROM profile', [], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getProfile(userId, success, failure) {
    db.query('SELECT id, user, first_name as firstName, last_name as lastName, description FROM profile WHERE user = ?',
        [userId], rows => {
        if (rows.length) {
            success(rows[0]);
        } else {
            success();
        }
    }, error => {
        console.log(error);
        failure(error);
    });
}

function addProfile(profile, success, failure) {
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    db.query('INSERT INTO profile (user, first_name, last_name, description, date_created) VALUES (?, ?, ?, ?, ?)',
        [profile.userId, profile.firstName, profile.lastName, profile.description, utc], data => {
            success(data);
        }, error => {
            console.log(error);
            failure(error);
        });
}

module.exports = {
    getAllProfiles,
    getProfile,
    addProfile
};