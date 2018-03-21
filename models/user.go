package models

import (
	"github.com/jinzhu/gorm"

	"github.com/centre-for-educational-technology/Padevusplatvorm-be/config"
	"github.com/gin-gonic/gin"
)

// User model "extends" gorm.Model
type User struct {
	gorm.Model
	Name     string
	Email    string
	Password string
}

// CreateUser - create a new User
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

// GetAllUsers - returns all users from db
func GetAllUsers(c *gin.Context) {
	var users []User

	if err := config.DB.Find(&users).Error; err != nil {
		c.JSON(404, gin.H{
			"status": 404,
			"error":  err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"count":  len(users),
			"result": users,
		})
	}
}

// GetUser - return user by id
func GetUser(c *gin.Context) {
	id := c.Param("id")
	var user User

	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(404, gin.H{
			"status":  404,
			"message": "User with id=" + id + " not found",
			"error":   err.Error(),
		})
	} else {
		c.JSON(200, gin.H{
			"status": 200,
			"result": user,
		})
	}
}

func UpdateUser() {
	//TODO
}

func DeleteUser() {
	//TODO
}
