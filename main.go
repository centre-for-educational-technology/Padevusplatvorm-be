package main

import (
	"github.com/centre-for-educational-technology/Padevusplatvorm-be/models"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// Router
func setupRouter() *gin.Engine {
	router := gin.Default()
	v1 := router.Group("/v1")
	{
		v1.GET("/ping", models.Ping)
		v1.GET("/user/:id", models.GetUser)
		v1.GET("/users", models.GetAllUsers)
	}
	return router
}

// main function to boot up everything
func main() {
	models.InitDB("root:example@tcp(172.18.0.2:3306)/Padevusplatvorm?charset=utf8&parseTime=True&loc=Local")
	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")
}
