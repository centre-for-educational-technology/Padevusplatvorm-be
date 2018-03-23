package models

import (
	"github.com/centre-for-educational-technology/Padevusplatvorm-be/config"
	"github.com/gin-gonic/gin"
)

// QualificationStandard model embeds model.Model
type QualificationStandard struct {
	Model
	Name         string       `json:"name"`
	EkrLevel     int          `json:"ekrLevel"`
	Description  string       `json:"description"`
	Image        string       `json:"image"`
	Competencies []Competency `json:"competencies"`
}

// Competency model for One-To-Many relatsion
type Competency struct {
	Model
	QualificationStandardID                   uint        `json:"qualificationStandardId"`
	Name                                      string      `json:"name"`
	Description                               string      `json:"description"`
	QualificationLevelRequirementsDescription string      `json:"qualificationLevelRequirementsDescription"`
	Knowledges                                []Knowledge `json:"knowledges"`
	Skills                                    []Skill     `json:"skills"`
}

// Knowledge model for One-To-Many relatsion
type Knowledge struct {
	Model
	CompetencyID uint   `json:"competencyId"`
	Name         string `json:"name"`
	Description  string `json:"description"`
}

// Skill model for One-To-Many relatsion
type Skill struct {
	Model
	CompetencyID uint   `json:"competencyId"`
	Name         string `json:"name"`
	Description  string `json:"description"`
}

// CreateQualificationStandard - create a new Qualification standard
func CreateQualificationStandard(c *gin.Context) {
	var standard QualificationStandard

	c.BindJSON(&standard)
	if err := config.DB.Create(&standard).Error; err != nil {
		c.JSON(404, gin.H{
			"status": 404,
			"error":  err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status":  200,
			"result":  standard,
			"message": "Standard created",
		})
	}

}

// GetAllQualificationStandards - returns all Qualification standards
func GetAllQualificationStandards(c *gin.Context) {
	var standards []QualificationStandard

	// Using gorm:auto_preload (Eager loading)
	if err := config.DB.Set("gorm:auto_preload", true).Find(&standards).Error; err != nil {
		c.JSON(404, gin.H{
			"status": 404,
			"error":  err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"count":  len(standards),
			"result": standards,
		})
	}
}

// GetQualificationStandard - returns Qualifiacation standard by id
func GetQualificationStandard(c *gin.Context) {
	id := c.Param("id")
	var standard QualificationStandard

	// Using gorm:auto_preload (Eager loading)
	if err := config.DB.Set("gorm:auto_preload", true).First(&standard, id).Error; err != nil {
		c.JSON(404, gin.H{
			"status": 404,
			"error":  err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"result": standard,
		})
	}
}
