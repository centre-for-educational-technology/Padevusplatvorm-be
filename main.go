package main

import (
	"github.com/centre-for-educational-technology/Padevusplatvorm-be/config"
	"github.com/centre-for-educational-technology/Padevusplatvorm-be/models"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// Router
func setupRouter() *gin.Engine {
	router := gin.Default()
	v1 := router.Group("/api/v1")
	{
		v1.POST("/auth/register", models.CreateUser)

		v1.GET("/user/:id", models.GetUser)
		v1.GET("/users", models.GetAllUsers)

		v1.GET("/standard/:id", models.GetQualificationStandard)
		v1.POST("/standard/create", models.CreateQualificationStandard)
		v1.GET("/standards", models.GetAllQualificationStandards)
	}
	return router
}

func main() {
	config.InitDB("root:example@tcp(172.18.0.2:3306)/Padevusplatvorm?charset=utf8&parseTime=True&loc=Local")
	config.DB.AutoMigrate(&models.User{}, &models.QualificationStandard{}, &models.Competency{}, &models.Knowledge{}, &models.Skill{})

	r := setupRouter()
	r.Run(":8080")
}
