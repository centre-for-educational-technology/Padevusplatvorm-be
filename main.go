package main

import (
	"fmt"
	"log"

	"database/sql"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// Global sql.DB to access the database by all handlers
var db *sql.DB
var err error

// User global struct
type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// main function to boot up everything
func main() {
	// open db connection
	db, err = sql.Open("mysql",
		"root:example@tcp(172.18.0.2:3306)/Padevusplatvorm")
	// if there is an error opening the connection, handle it
	if err != nil {
		log.Fatal(err)
	}
	// defer the close till after the main function has finished
	// executing
	defer db.Close()

	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run(":8080")

}

func setupRouter() *gin.Engine {
	router := gin.Default()
	router.GET("/ping", ping)
	router.GET("/user/:id", getUser)
	router.GET("/users", getAllUsers)
	return router
}

func getUser(c *gin.Context) {
	var (
		user   User
		result gin.H
	)
	id := c.Param("id")
	row := db.QueryRow("select id, name from test where id = ?;", id)
	err = row.Scan(&user.ID, &user.Name)
	if err != nil {
		result = gin.H{
			"result": nil,
			"count":  0,
		}
	} else {
		result = gin.H{
			"result": user,
			"count":  1,
		}
	}
	c.JSON(200, result)
}

func getAllUsers(c *gin.Context) {
	var (
		user  User
		users []User
	)
	rows, err := db.Query("SELECT id, name FROM test;")
	if err != nil {
		fmt.Print(err)
	}
	for rows.Next() {
		err = rows.Scan(&user.ID, &user.Name)
		users = append(users, user)
		if err != nil {
			fmt.Print(err)
		}
	}
	defer rows.Close()

	if len(users) <= 0 {
		c.JSON(404, gin.H{
			"status":  404,
			"message": "No users found",
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"result": users,
			"count":  len(users),
		})
	}
}

func ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
		"tere":    "kaks",
	})
}
