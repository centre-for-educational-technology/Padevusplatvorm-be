package config

import (
	"log"

	"github.com/jinzhu/gorm"
)

// DB - Global database
var DB *gorm.DB

// InitDB initialize database connection
func InitDB(dataSourceName string) {
	// open db connection
	var err error
	DB, err = gorm.Open("mysql", dataSourceName)

	// if there is an error opening the connection, handle it
	if err != nil {
		log.Fatal(err)
	}
}
