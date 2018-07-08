const express = require('express');
const router = express.Router();
const restModel = require('../rest/restModel');
const standard = require('../standard/standard');
const competency = require('../competency/competency');
const course = require('../course/course');

router.get('/', function (req, res) {
    try {
        standard.getAllStandards(data => {
            restModel.generateResponse(base => {
                base.data = data;
                base.userMessage = 'Retrieved all standards.';
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

router.get('/:standardId', function (req, res) {
    try {
        const standardId = req.params.standardId;
        standard.getStandard(standardId, retrievedStandard => {
            competency.getStandardCompetencies(standardId, retrievedCompetencies => {
                const idList = retrievedCompetencies.map(competency => competency.id);
                let subCompetencyCount = 0;
                competency.getCompetencyData(idList, retrievedData => {
                    retrievedCompetencies.forEach(competency => {
                        competency.skills = retrievedData.filter(data => data.type === 'skill' && data.competency === competency.id);
                        competency.knowledge = retrievedData.filter(data => data.type === 'knowledge' && data.competency === competency.id);
                        subCompetencyCount = subCompetencyCount + competency.skills.length + competency.knowledge.length;
                    });
                    retrievedStandard.competencies = retrievedCompetencies;
                    retrievedStandard.subCompetencyCount = subCompetencyCount;
                    restModel.generateResponse(base => {
                        base.data = retrievedStandard;
                        base.userMessage = 'Retrieved standard.';
                        res.send(base);
                    });
                }, error => {
                    console.log(error);
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

router.get('/:standardId/courses', function (req, res) {
    const standardId = req.params.standardId;
    try {
        course.getAllStandardCourses(standardId, courses => {
            restModel.generateResponse(base => {
                base.data = courses;
                base.userMessage = 'Retrieved all standard coursess.';
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
    const standardToAdd = req.body.standard;
    try {
        standard.addStandard(standardToAdd, addedStandard => {
            const standardId = addedStandard.insertId;
            standardToAdd.competencies.forEach(competencyToAdd => {
                // TODO
                competency.addStandardCompetency(standardId, competencyToAdd,
                    addedCompetency => {
                        console.log(addedCompetency);
                    },
                    nokData => {
                        console.log(nokData)
                    })
            });
            restModel.generateResponse(base => {
                base.userMessage = 'Standard added.';
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
