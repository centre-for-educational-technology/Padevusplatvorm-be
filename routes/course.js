const express = require('express');
const router = express.Router();
const restModel = require('../rest/restModel');
const course = require('../course/course');
const competency = require('../competency/competency');

router.get('/', function (req, res) {
    try {
        course.getAllCourses(data => {
            restModel.generateResponse(base => {
                base.data = data;
                base.userMessage = 'Retrieved all courses.';
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


router.get('/:courseId(\\d+)/', function (req, res) {
    try {
        const courseId = req.params.courseId;
        course.getCourse(courseId, retrievedCourse => {
            retrievedCourse.competencies = [];
            competency.getCourseCompetencies(courseId, retrievedCompetencies => {
                retrievedCourse.competencies.push({
                    skills: retrievedCompetencies
                        .filter(data => data.type === 'skill'),
                    knowledge: retrievedCompetencies
                        .filter(data => data.type === 'knowledge')
                });
                retrievedCourse.competencies = retrievedCompetencies;
                restModel.generateResponse(base => {
                    base.data = retrievedCourse;
                    base.userMessage = 'Retrieved standard.';
                    res.send(base);
                });
            }, error => {
                restModel.generateErrorResponse(base => {
                    res.statusCode = 500;
                    base.error = error.message;
                    res.send(base);
                })
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
    const courseToAdd = req.body.course;
    try {
        course.addCourse(courseToAdd, data => {
            const courseId = data.insertId;
            courseToAdd.competencies.concat(courseToAdd.freeformCompetencies)
                .forEach(subcompetencyId => {
                competency.addSubCompetencyToCourse(courseId, subcompetencyId,
                    okData => {
                        console.log(okData)
                    },
                    nokData => {
                        console.log(nokData)
                    })
            });
            restModel.generateResponse(base => {
                base.userMessage = 'Course added.';
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

router.get('/freeformCompetencies', function (req, res) {
    try {
        competency.getFreeformCompetencies(retrievedCompetencies => {
            restModel.generateResponse(base => {
                base.data = retrievedCompetencies;
                base.userMessage = 'Retrieved freeform competencies.';
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

router.post('/addFreeformCompetency', function (req, res) {
    const competencyToAdd = req.body.competency;
    try {
        competency.addFreeformCompetency(competencyToAdd, addedCompetency => {
            competency.getFreeformCompetencies(retrievedCompetencies => {
                restModel.generateResponse(base => {
                    base.data = {
                        id: addedCompetency.insertId,
                        freeformCompetencies: retrievedCompetencies
                    };
                    base.userMessage = 'Freeform competency added.';
                    res.send(base);
                });
            }, error => {
                restModel.generateErrorResponse(base => {
                    res.statusCode = 500;
                    base.error = error.message;
                    res.send(base);
                })
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
