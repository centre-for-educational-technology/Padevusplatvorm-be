package models

import (
	"time"

	"github.com/jinzhu/gorm"

	"github.com/centre-for-educational-technology/Padevusplatvorm-be/config"
	"github.com/gin-gonic/gin"
)

// Model - gorm model defaults
type Model struct {
	ID        uint `gorm:"primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

// User global struct
type User struct {
	gorm.Model
	Name     string
	Email    string
	Password string
}

// CreateUser - Register a new user
func CreateUser(c *gin.Context) {
	var user User
	c.BindJSON(&user)
	if len(user.Name) <= 0 {
		c.JSON(400, gin.H{
			"status":  400,
			"message": "Name cant be empty!",
		})
	} else {
		config.DB.Create(&user)
		c.JSON(200, gin.H{
			"status":  200,
			"result":  user,
			"message": "User created",
		})
	}
}

/*
// GetAllUsers - Get all users
func GetAllUsers(c *gin.Context) {
	var (
		user  User
		users []User
	)
	rows, err := config.DB.Query("SELECT id, name FROM users;")
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
	row := config.DB.QueryRow("select id, name from users where id = ?;", id)
	err := row.Scan(&user.ID, &user.Name)
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
*/
