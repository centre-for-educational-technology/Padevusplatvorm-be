package models

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB
var err error

// InitDB initialize database connection
func InitDB(dataSourceName string) {
	// open db connection
	db, err = sql.Open("mysql", dataSourceName)

	// if there is an error opening the connection, handle it
	if err != nil {
		log.Fatal(err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}
	// defer the close till after the main function has finished
	// executing
	//defer db.Close()
}
