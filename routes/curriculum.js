const express = require('express');
const router = express.Router();
const restModel = require('../rest/restModel');
const curriculum = require('../curriculum/curriculum');
const competency = require('../competency/competency');

router.get('/', function (req, res) {
    try {
        curriculum.getAllCurricula(data => {
            restModel.generateResponse(base => {
                base.data = data;
                base.userMessage = 'Retrieved all curricula.';
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

router.get('/:curriculumId', function (req, res) {
    try {
        const curriculumId = req.params.curriculumId;
        curriculum.getCurriculum(curriculumId, retrievedCurriculum => {
            restModel.generateResponse(base => {
                base.data = retrievedCurriculum;
                base.userMessage = 'Retrieved curriculum.';
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

router.get('/:curriculumId/compliance', function (req, res) {
    try {
        const curriculumId = req.params.curriculumId;
        competency.getCurriculumCompetencyCount(curriculumId, curriculumCount => {
            competency.getStandardCompetencyCount(curriculumId, standardCount => {
                restModel.generateResponse(base => {
                    base.data = {
                        curriculumCount,
                        standardCount
                    };
                    base.userMessage = 'Retrieved curriculum compliance.';
                    res.send(base);
                });
            }, error => console.log(error));
        }, error => console.log(error));
    } catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.get('/:curriculumId/competencies', function (req, res) {
    try {
        const curriculumId = req.params.curriculumId;
        competency.getCurriculumCompetencies(curriculumId, retrievedCompetencies => {
            restModel.generateResponse(base => {
                base.data = retrievedCompetencies;
                base.userMessage = 'Retrieved curriculum competencies.';
                res.send(base);
            });
        }, error => console.log(error));
    } catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.get('/:curriculumId/modules', function (req, res) {
    try {
        const curriculumId = req.params.curriculumId;
        curriculum.getCurriculumModules(curriculumId, retrievedModules => {
            restModel.generateResponse(base => {
                base.data = retrievedModules;
                base.userMessage = 'Retrieved curriculum modules.';
                res.send(base);
            });
        }, error => console.log(error));
    } catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.get('/:curriculumId/courses', function (req, res) {
    try {
        const curriculumId = req.params.curriculumId;
        curriculum.getCurriculumCourses(curriculumId, retrievedCourses => {
            restModel.generateResponse(base => {
                base.data = retrievedCourses;
                base.userMessage = 'Retrieved curriculum courses.';
                res.send(base);
            });
        }, error => console.log(error));
    } catch (err) {
        restModel.generateErrorResponse(base => {
            res.statusCode = 500;
            base.error = 'Something went wrong. Please try again.';
            res.send(base);
        });
    }
});

router.post('/add', function (req, res) {
    const curriculumToAdd = req.body.curriculum;
    try {
        curriculum.addCurriculum(curriculumToAdd,
            addedCurriculum => {
                curriculumToAdd.modules.forEach(moduleToAdd => {
                    curriculum.addModule(addedCurriculum.insertId, moduleToAdd,
                        addedModule => {
                            moduleToAdd.courses.forEach(courseToAdd => {
                                curriculum.addCourseToModule(
                                    addedModule.insertId,
                                    courseToAdd,
                                    success => {
                                        restModel.generateResponse(base => {
                                            base.data = success;
                                            base.userMessage = 'Retrieved course.';
                                            res.send(base);
                                        });
                                    },
                                    nokData => console.log(nokData)
                                );
                            })
                        },
                        nokData => {
                            console.log(nokData)
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
