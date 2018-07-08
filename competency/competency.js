const db = require('../database/data');
const moment = require('moment');

function getAllCompetencies(success, failure) {
    db.query('SELECT * FROM competency', [], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getFreeformCompetencies(success, failure) {
    db.query('SELECT * FROM subcompetency WHERE type = "freeform"', [], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getStandardCompetencies(standardId, success, failure) {
    db.query('SELECT * FROM competency WHERE standard = ?', [standardId], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getCourseCompetencies(courseId, success, failure) {
    db.query('SELECT subcompetency.*, competency.name AS competencyName FROM subcompetency ' +
        'LEFT JOIN competency ON subcompetency.competency = competency.id ' +
        'WHERE subcompetency.id in (SELECT fk_subcompetency FROM course_subcompetency WHERE fk_course = ?) ',
        [courseId], rows => {
            success(rows);
        }, error => {
            console.log(error);
            failure(error);
        });
}

function getCurriculumCompetencies(curriculumId, success, failure) {
    db.query('SELECT * FROM subcompetency  WHERE id in ' +
        '(SELECT fk_subcompetency FROM course_subcompetency WHERE fk_course in ' +
        '(SELECT fk_course from module_course WHERE fk_module in ' +
        '(SELECT id from module where curriculum = ?)))', [curriculumId], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getCurriculumCompetencyCount(curriculumId, success, failure) {
    db.query('SELECT COUNT(*) as curriculumCount ' +
        'FROM subcompetency ' +
        'WHERE subcompetency.type != "freeform" AND subcompetency.id IN (SELECT fk_subcompetency ' +
        'FROM course_subcompetency ' +
        'WHERE fk_course in (SELECT fk_course ' +
        'FROM module_course ' +
        'WHERE fk_module in ( SELECT id FROM module WHERE curriculum = ?)))', [curriculumId], rows => {
        success(rows[0].curriculumCount);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getStandardCompetencyCount(curriculumId, success, failure) {
    db.query('SELECT COUNT(*) as standardCount FROM subcompetency WHERE competency IN ' +
        '(SELECT id FROM competency WHERE standard = ' +
        '( SELECT standard FROM curriculum WHERE id = ?))', [curriculumId], rows => {
        success(rows[0].standardCount);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getCompetency(competencyId, success, failure) {
    db.query('SELECT * FROM competency WHERE id = ?', [competencyId], rows => {
        if (rows.length) {
            success(rows[0]);
        }
    }, error => {
        console.log(error);
        failure(error);
    });
}

function getCompetencyData(competencyIdList, success, failure) {
    db.query('SELECT * FROM subcompetency WHERE competency in (?)', [competencyIdList], rows => {
        success(rows);
    }, error => {
        console.log(error);
        failure(error);
    });
}

function addStandardCompetency(standardId, competency, success, failure) {
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    db.query('INSERT INTO competency (name, standard, date_created) VALUES (?, ?, ?)',
        [competency.name, standardId, utc], addedCompetency => {
            competency.skills.forEach(skillToAdd => {
                // TODO
                addSubcompetency(skillToAdd, 'skill', addedCompetency.insertId,
                    addedSkill => {
                        console.log(addedSkill);
                    },
                    nokData => {
                        console.log(nokData);
                    })
            });
            competency.knowledge.forEach(knowledgeToAdd => {
                // TODO
                addSubcompetency(knowledgeToAdd, 'knowledge', addedCompetency.insertId,
                    addedKnowledge => {
                        console.log(addedKnowledge);
                    },
                    nokData => {
                        console.log(nokData);
                    })
            });
        }, error => {
            console.log(error);
            failure(error);
        });
}

function addFreeformCompetency(competency, success, failure) {
    return addSubcompetency(competency, 'freeform', null, success, failure);
}

function addSubCompetencyToCourse(courseId, subCompetencyId, success, failure) {
    db.query('INSERT INTO course_subcompetency (fk_course, fk_subcompetency) VALUES (?, ?)',
        [courseId, subCompetencyId], data => {
            success(data);
        }, error => {
            console.log(error);
            failure(error);
        });
}

function addSubcompetency(subCompetency, type, competencyId, success, failure) {
    const utc = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    db.query('INSERT INTO subcompetency (type, name, competency, date_created) VALUES (?, ?, ?, ?)',
        [type, subCompetency.name, competencyId, utc], addedCompetency => {
            success(addedCompetency);
        }, error => {
            console.log(error);
            failure(error);
        });
}

module.exports = {
    getAllCompetencies,
    getFreeformCompetencies,
    getStandardCompetencies,
    getCourseCompetencies,
    getCurriculumCompetencies,
    getCurriculumCompetencyCount,
    getStandardCompetencyCount,
    getCompetency,
    getCompetencyData,
    addStandardCompetency,
    addFreeformCompetency,
    addSubCompetencyToCourse
};