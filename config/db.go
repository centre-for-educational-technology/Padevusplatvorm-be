package config

import (
	"log"

	"github.com/jinzhu/gorm"
)

// DB - Global database
var DB *gorm.DB

// InitDB initialize database connection
func InitDB(dataSourceName string) {
	var err error

	DB, err = gorm.Open("mysql", dataSourceName)
	if err != nil {
		log.Fatal(err)
	}
}
