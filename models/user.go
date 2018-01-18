package models

import (
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// User global struct
type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// GetAllUsers - Get all users
func GetAllUsers(c *gin.Context) {
	var (
		user  User
		users []User
	)
	rows, err := db.Query("SELECT id, name FROM users;")
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

// GetUser - Get user by id
func GetUser(c *gin.Context) {
	var (
		user   User
		result gin.H
	)
	id := c.Param("id")
	row := db.QueryRow("select id, name from users where id = ?;", id)
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

// Ping - test ping
func Ping(c *gin.Context) {
	// Test if all working
	c.JSON(200, gin.H{
		"message": "pong",
		"tere":    "kaks",
	})
}
