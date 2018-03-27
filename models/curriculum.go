package models

import (
	"github.com/centre-for-educational-technology/Padevusplatvorm-be/config"
	"github.com/gin-gonic/gin"
)

// Curriculum model embeds model.Model
type Curriculum struct {
	Model
	ProgrammeTitle      string `json:"programmeTitle"`
	Coordinator         string `json:"coordinator"`
	ProgrammeGroup      string `json:"programmeGroup"`
	Volume              int    `json:"volume"`
	Code                int    `json:"code"`
	NominalDuration     int    `json:"nominalDuration"`
	ValidityPeriodStart int    `json:"validityPeriodStart" gorm:"type:YEAR"`
	ValidityPeriodEnd   int    `json:"validityPeriodEnd" gorm:"type:YEAR"`
	StudyLevel          string `json:"studyLevel"`
	// TODO: Subjects correct relation (Many-to-Many, Has Many or something else...)
	Subjects []Subject `json:"subjects"`
}

// CreateCurriculum - create a new Curriculum
func CreateCurriculum(c *gin.Context) {
	var curriculum Curriculum

	if err := c.BindJSON(&curriculum); err != nil {
		c.JSON(400, gin.H{
			"status": 400,
			"error":  "json decoding: " + err.Error(),
		})
	} else {
		if err := config.DB.Create(&curriculum).Error; err != nil {
			c.JSON(404, gin.H{
				"status": 404,
				"error":  err.Error(),
			})
		} else {
			c.JSON(200, gin.H{
				"status":  200,
				"result":  curriculum,
				"message": "Curriculum created",
			})
		}
	}

}

// GetAllCurriculums - return all Curriculums
func GetAllCurriculums(c *gin.Context) {
	var curriculums []Curriculum

	if err := config.DB.Set("gorm:auto_preload", true).Find(&curriculums).Error; err != nil {
		c.JSON(404, gin.H{
			"status": 404,
			"error":  err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"count":  len(curriculums),
			"result": curriculums,
		})
	}
}

/* TODO: GetCurriculum
func GetCurriculum() {
}
/*

/* TODO: UpdateCurriculum
func UpdateCurriculum() {
}
/*

/* TODO: DeleteCurriculum
func DeleteCurriculum() {
}
*/
