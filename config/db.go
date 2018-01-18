package config

import (
	"database/sql"
	"log"
)

// DB - Global database
var DB *sql.DB

// InitDB initialize database connection
func InitDB(dataSourceName string) {
	// open db connection
	var err error
	DB, err = sql.Open("mysql", dataSourceName)

	// if there is an error opening the connection, handle it
	if err != nil {
		log.Fatal(err)
	}
	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}
}
