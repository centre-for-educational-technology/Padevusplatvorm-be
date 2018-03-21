package models

import (
	"github.com/centre-for-educational-technology/Padevusplatvorm-be/config"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

// QualificationStandard model "extends" gorm.Model
type QualificationStandard struct {
	gorm.Model
	Name         string
	EkrLevel     int
	Description  string
	Image        string
	Competencies []Competency
}

// Competency model for One-To-Many relatsion
type Competency struct {
	gorm.Model
	QualificationStandardID                   uint
	Name                                      string
	Description                               string
	QualificationLevelRequirementsDescription string
	Knowledges                                []Knowledge
	Skills                                    []Skill
}

// Knowledge model for One-To-Many relatsion
type Knowledge struct {
	gorm.Model
	CompetencyID uint
	Name         string
	Description  string
}

// Skill model for One-To-Many relatsion
type Skill struct {
	gorm.Model
	CompetencyID uint
	Name         string
	Description  string
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
			"status":  404,
			"message": "Standard with id=" + id + " not found",
			"error":   err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"result": standard,
		})
	}
}
