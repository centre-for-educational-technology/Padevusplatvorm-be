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
		//v1.GET("/user/:id", models.GetUser)
		//v1.GET("/users", models.GetAllUsers)
	}
	return router
}

func main() {
	config.InitDB("root:example@tcp(172.18.0.2:3306)/Padevusplatvorm?charset=utf8&parseTime=True&loc=Local")
	config.DB.AutoMigrate(&models.User{})

	r := setupRouter()
	r.Run(":8080")
}
