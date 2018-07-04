const db = require('../database/data');
const moment = require('moment');

function getAllCurricula(success, failure) {
    db.query('SELECT * FROM curriculum', [], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getCurriculum(curriculumId, success, failure) {
    db.query('SELECT curriculum.*, standard.name as standardName, standard.level as standardLevel ' +
        'FROM curriculum LEFT JOIN standard ON standard.id = curriculum.standard ' +
        'WHERE curriculum.id = ?', [curriculumId], rows => {
        if (rows.length) {
            success(rows[0]);
        }
    }, error => {
        console.log(error);
        failure(error);
    });
}

function addCurriculum(curriculum, success, failure) {
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    db.query('INSERT INTO curriculum (title, coordinator, programme_group, code, duration, validity_start, validity_end, ' +
        'study_level, standard, date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [curriculum.title, curriculum.coordinator, curriculum.programmeGroup, curriculum.code, curriculum.duration,
            curriculum.validityStart, curriculum.validityEnd, curriculum.studyLevel, curriculum.standard, utc], data => {
            success(data)
        }, error => {
            console.log(error);
            failure(error);
        });
}

function addModule(curriculumId, module, success, failure) {
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    db.query('INSERT INTO module (name, volume, objectives, outcomes, curriculum, date_added) VALUES (?, ?, ?, ?, ?, ?)',
        [module.name, module.volume, module.objectives, module.outcomes, curriculumId, utc], data => {
            success(data);
        }, error => {
            console.log(error);
            failure(error);
        });
}

function getCurriculumModules(curriculumId, success, failure) {
    db.query('SELECT * FROM module WHERE curriculum = ?', [curriculumId], rows => {
        if (rows.length) {
            success(rows);
        }
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getCurriculumCourses(curriculumId, success, failure) {
    db.query('SELECT course.*, module_course.fk_module as module FROM course ' +
        'INNER JOIN module_course ON module_course.fk_course = course.id WHERE course.id IN ' +
        '(SELECT fk_course FROM module_course WHERE fk_module IN ' +
        '(SELECT module.id FROM module WHERE module.curriculum = ?));', [curriculumId], rows => {
        if (rows.length) {
            success(rows);
        }
    }, error => {
        console.log(error);
        failure(error);
    });
}

function addCourseToModule(moduleId, courseId, success, failure) {
    db.query('INSERT INTO module_course (fk_module, fk_course) VALUES (?, ?)',
        [moduleId, courseId], data => {
            success(data);
        }, error => {
            console.log(error);
            failure(error);
        });
}

module.exports = {
    getAllCurricula,
    getCurriculum,
    getCurriculumModules,
    getCurriculumCourses,
    addCurriculum,
    addModule,
    addCourseToModule
};