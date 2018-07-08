const db = require('../database/data');
const moment = require('moment');

function getAllCourses(success, failure) {
    db.query('SELECT * FROM course WHERE deleted = 0', [], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getAllStandardCourses(standardId, success, failure) {
    db.query('SELECT * FROM course WHERE standard = ? AND deleted = 0', [standardId], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}


function getCourse(courseId, success, failure) {
    db.query('SELECT course.*, standard.name AS standardName, standard.level AS standardLevel ' +
        'FROM course LEFT JOIN standard ON standard.id = course.standard WHERE course.id = ? AND course.deleted = 0', [courseId], rows => {
        if (rows.length) {
            success(rows[0]);
        }
    }, error => {
        console.log(error);
        failure(error);
    });
}

function addCourse(course, success, failure) {
    console.log(course);
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    db.query('INSERT INTO course (title, code, volume, contact_hours, semester, assessment, lecturer, standard, date_created)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [course.title, course.code, course.volume, course.contactHours, course.semester, course.assessment, course.lecturer, course.standard, utc], data => {
            success(data);
        }, error => {
            console.log(error);
            failure(error);
        });
}

module.exports = {
    getAllCourses,
    getAllStandardCourses,
    getCourse,
    addCourse
};