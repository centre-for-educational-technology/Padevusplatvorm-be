package models

import (
	"github.com/centre-for-educational-technology/Padevusplatvorm-be/config"
	"github.com/gin-gonic/gin"
)

// Subject model embeds model.Model
type Subject struct {
	Model
	Title                   string              `json:"title"`
	AlternativeTitle        string              `json:"alternativeTitle"`
	Code                    string              `json:"code"`
	Volume                  int                 `json:"volume"`
	ContactHours            int                 `json:"contactHours"`
	MainLecturer            string              `json:"mainLecturer"`
	QualificationStandardID uint                `json:"qualificationStandardId"`
	Competencies            []SubjectCompetency `json:"competencies"`
}

// SubjectCompetency model for One-To-Many relatsion
type SubjectCompetency struct {
	Model
	SubjectID uint   `json:"subjectId"`
	Name      string `json:"name"`
}

// CreateSubject - create a new Subject
func CreateSubject(c *gin.Context) {
	var subject Subject

	if err := c.BindJSON(&subject); err != nil {
		c.JSON(400, gin.H{
			"status": 400,
			"error":  "json decoding: " + err.Error(),
		})
	} else {
		if err := config.DB.Create(&subject).Error; err != nil {
			c.JSON(404, gin.H{
				"status": 404,
				"error":  err.Error(),
			})
		} else {
			c.JSON(200, gin.H{
				"status":  200,
				"result":  subject,
				"message": "Subject created",
			})
		}
	}
}

// GetAllSubjects - returns all Subjects
func GetAllSubjects(c *gin.Context) {
	var subjects []Subject

	if err := config.DB.Set("gorm:auto_preload", true).Find(&subjects).Error; err != nil {
		c.JSON(404, gin.H{
			"status": 404,
			"error":  err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"count":  len(subjects),
			"result": subjects,
		})
	}
}

/* TODO: GetSubject
func GetSubject() {
}
/*

/* TODO: UpdateSubject
func UpdateSubject() {
}
/*

/* TODO: DeleteSubject
func DeleteSubject() {
}
*/
