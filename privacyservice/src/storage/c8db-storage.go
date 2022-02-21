package storage

// https://stackoverflow.com/questions/21986780/is-it-possible-to-retrieve-a-column-value-by-name-using-golang-database-sql

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"os"
	"strconv"
	"strings"

	_ "github.com/mattn/go-sqlite3" // load sqlite3 here
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	knownApps2 []string
)

//var apikey = "apikey joubert_databunker.com.databunkerDemo.VpT4zqdTT5qz4PycrDW2ItXFYGgcX8FOVJljFlEI3tMBAP7lnQBBoL3zgqRIlfuKf15116"
//var mmurl = "https://api-joubert-us-east.eng.macrometa.io"

// C8DB struct is used to store database object
type C8DB struct {
	db *sql.DB
}

func getMMUrl() string {
	return os.Getenv("MMURL")
}

func getMMApikey() string {
	return "apikey " + os.Getenv("MMAPIKEY")
}

func getMMFabric() string {
	return os.Getenv("MMFABRIC")
}

// DBExists function checks if database exists
func (dbobj C8DB) DBExists(filepath *string) bool {

	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/collection/xtokens"

	client := &http.Client{}
	req, err := http.NewRequest("GET", endpoint, nil)
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)
	//debug(httputil.DumpResponse(resp, true))
	return strings.Contains(resp.Status, "200")
}

// CreateTestDB creates a test db
func (dbobj C8DB) CreateTestDB() string {
	//fmt.Println("*** CreateTestDB")

	testDBFile := "/tmp/test-sqlite.db"
	os.Remove(testDBFile)
	return testDBFile
}

// OpenDB function opens the database
func (dbobj *C8DB) OpenDB(filepath *string) error {
	//fmt.Printf("OpenDB: filepath:%s", filepath)
	fmt.Printf("******** Databunker with C8DB\n")

	// dbfile := "./databunker.db"
	// if filepath != nil {
	// 	if len(*filepath) > 0 {
	// 		dbfile = *filepath
	// 	}
	// }
	// if len(dbfile) >= 3 && dbfile[len(dbfile)-3:] != ".db" {
	// 	dbfile = dbfile + ".db"
	// }
	// // collect list of all tables
	// /*
	// 	if _, err := os.Stat(dbfile); !os.IsNotExist(err) {
	// 		db2, err := ql.OpenFile(dbfile, &ql.Options{FileFormat: 2})
	// 		if err != nil {
	// 			return dbobj, err
	// 		}
	// 		dbinfo, err := db2.Info()
	// 		for _, v := range dbinfo.Tables {
	// 			knownApps = append(knownApps, v.Name)
	// 		}
	// 		db2.Close()
	// 	}
	// */

	// //ql.RegisterDriver2()
	// //db, err := sql.Open("ql2", dbfile)
	// db, err := sql.Open("sqlite3", "file:"+dbfile+"?_journal_mode=WAL")
	// if err != nil {
	// 	log.Fatalf("Failed to open databunker.db file: %s", err)
	// 	return err
	// }
	// err = db.Ping()
	// if err != nil {
	// 	log.Fatalf("Error on opening database connection: %s", err.Error())
	// 	return err
	// }
	// _, err = db.Exec("vacuum")
	// if err != nil {
	// 	log.Fatalf("Error on vacuum database command")
	// }
	// dbobj.db = db
	// // load all table names
	// q := "select name from sqlite_master where type ='table'"
	// tx, err := dbobj.db.Begin()
	// if err != nil {
	// 	return err
	// }
	// defer tx.Rollback()
	// rows, err := tx.Query(q)
	// for rows.Next() {
	// 	t := ""
	// 	rows.Scan(&t)
	// 	knownApps2 = append(knownApps2, t)
	// }
	// tx.Commit()
	// log.Printf("List of tables: %s\n", knownApps2)
	return nil
}

// InitDB function creates tables and indexes
func (dbobj *C8DB) InitDB(filepath *string) error {
	//fmt.Println("*** InitDB")

	log.Printf("Creating tables")
	dbobj.initUsers()
	dbobj.initXTokens()
	dbobj.initAudit()
	dbobj.initSessions()
	dbobj.initUserapps()
	dbobj.initRequests()
	dbobj.initSharedRecords()
	dbobj.initProcessingactivities()
	dbobj.initLegalbasis()
	dbobj.initAgreements()
	return nil
}

func (dbobj C8DB) Ping() error {
	//fmt.Println("*** Ping")

	return dbobj.db.Ping()
}

// CloseDB function closes the open database
func (dbobj *C8DB) CloseDB() {
	//fmt.Println("*** CloseDB")

	// if dbobj.db != nil {
	// 	dbobj.db.Close()
	// }
}

// BackupDB function backups existing databsae and prints database structure to http.ResponseWriter
func (dbobj C8DB) BackupDB(w http.ResponseWriter) {
	fmt.Println("BackupDB")

	// err := sqlite3dump.DumpDB(dbobj.db, w)
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	log.Printf("error in backup: %s", err)
	// }
}

func (dbobj C8DB) escapeName(name string) string {
	if name == "when" {
		name = "`when`"
	}
	return name
}

func (dbobj C8DB) decodeFieldsValues(data interface{}) (string, []interface{}) {
	fields := ""
	values := make([]interface{}, 0)

	switch t := data.(type) {
	case primitive.M:
		//fmt.Println("decodeFieldsValues format is: primitive.M")
		for idx, val := range data.(primitive.M) {
			if len(fields) == 0 {
				fields = dbobj.escapeName(idx)
			} else {
				fields = fields + "," + dbobj.escapeName(idx)
			}
			values = append(values, val)
		}
	case *primitive.M:
		//fmt.Println("decodeFieldsValues format is: *primitive.M")
		for idx, val := range *data.(*primitive.M) {
			if len(fields) == 0 {
				fields = dbobj.escapeName(idx)
			} else {
				fields = fields + "," + dbobj.escapeName(idx)
			}
			values = append(values, val)
		}
	case map[string]interface{}:
		//fmt.Println("decodeFieldsValues format is: map[string]interface{}")
		for idx, val := range data.(map[string]interface{}) {
			if len(fields) == 0 {
				fields = dbobj.escapeName(idx)
			} else {
				fields = fields + "," + dbobj.escapeName(idx)
			}
			values = append(values, val)
		}
	default:
		log.Printf("XXXXXX wrong type: %T\n", t)
	}
	return fields, values
}

func (dbobj C8DB) decodeForCleanup(data interface{}) string {
	fields := ""

	switch t := data.(type) {
	case primitive.M:
		for idx := range data.(primitive.M) {
			if len(fields) == 0 {
				fields = dbobj.escapeName(idx) + ": ''"
			} else {
				fields = fields + "," + dbobj.escapeName(idx) + ": ''"
			}
		}
		return fields
	case map[string]interface{}:
		for idx := range data.(map[string]interface{}) {
			if len(fields) == 0 {
				fields = dbobj.escapeName(idx) + ": ''"
			} else {
				fields = fields + "," + dbobj.escapeName(idx) + ": ''"
			}
		}
	default:
		log.Printf("decodeForCleanup: wrong type: %s\n", t)
	}

	return fields
}

func (dbobj C8DB) decodeForUpdate(bdoc *bson.M, bdel *bson.M) (string, []interface{}) {
	values := make([]interface{}, 0)
	fields := ""

	if bdoc != nil {
		/*
			switch t := *bdoc.(type) {
			default:
				fmt.Printf("Type is %T\n", t)
			}
		*/

		for idx, val := range *bdoc {
			values = append(values, val)
			if len(fields) == 0 {
				fields = dbobj.escapeName(idx) + "=$1"
			} else {
				fields = fields + "," + dbobj.escapeName(idx) + "=$" + (strconv.Itoa(len(values)))
			}
		}
	}

	if bdel != nil {
		for idx := range *bdel {
			if len(fields) == 0 {
				fields = dbobj.escapeName(idx) + "=null"
			} else {
				fields = fields + "," + dbobj.escapeName(idx) + "=null"
			}
		}
	}
	return fields, values
}

func (dbobj C8DB) Exec(q string) error {
	//	fmt.Println("*** Exec")

	_, err := dbobj.db.Exec(q)
	return err
}

// CreateRecordInTable creates new record
func (dbobj C8DB) CreateRecordInTable(tbl string, data interface{}) (int, error) {
	// //	fmt.Printf("CreateRecordInTable: tbl:%s\n", tbl)

	// 	fields, values := dbobj.decodeFieldsValues(data)
	// 	valuesInQ := "$1"
	// 	for idx := range values {
	// 		if idx > 0 {
	// 			valuesInQ = valuesInQ + ",$" + (strconv.Itoa(idx + 1))
	// 		}
	// 	}
	// 	q := "insert into " + tbl + " (" + fields + ") values (" + valuesInQ + ")"
	// 	fmt.Printf("q: %s\n", q)
	// 	for v := range values {
	// 		fmt.Printf("value: %s\n", v)
	// 	}

	// 	tx, err := dbobj.db.Begin()
	// 	if err != nil {
	// 		return 0, err
	// 	}
	// 	defer tx.Rollback()
	// 	_, err = tx.Exec(q, values...)
	// 	if err != nil {
	// 		return 0, err
	// 	}
	// 	if err = tx.Commit(); err != nil {
	// 		return 0, err
	// 	}
	return 0, nil
}

// CreateRecord creates new record
func (dbobj C8DB) CreateRecord(t Tbl, data interface{}) (int, error) {

	//	fmt.Println("*** CreateRecord")

	//if reflect.TypeOf(value) == reflect.TypeOf("string")
	tbl := GetTable(t)

	q := "insert {"
	for key, element := range *data.(*primitive.M) {
		q = q + "'" + key + "': '" + fmt.Sprintf("%v", element) + "',"
	}
	q = strings.TrimSuffix(q, ",")
	q = q + "} into " + tbl
	query := "{\"bindvars\":{}, \"query\": \"" + q + "\"}"

	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(query))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//	debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)

	if !strings.Contains(resp.Status, "201") {
		fmt.Printf("CreateRecord Table: %s\n", tbl)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}

	return 1, nil

	//return dbobj.CreateRecordInTable(tbl, data)
}

// CountRecords returns number of records in table
func (dbobj C8DB) CountRecords0(t Tbl) (int64, error) {
	//	fmt.Println("*** CountRecords0")

	// tbl := GetTable(t)
	// q := "select count(*) from " + tbl
	// //fmt.Printf("q: %s\n", q)

	// tx, err := dbobj.db.Begin()
	// if err != nil {
	// 	return 0, err
	// }
	// defer tx.Rollback()
	// row := tx.QueryRow(q)
	// // Columns
	// var count int
	// err = row.Scan(&count)
	// if err != nil {
	// 	return 0, err
	// }
	// if err = tx.Commit(); err != nil {
	// 	return 0, err
	// }
	// return int64(count), nil
	return 0, nil
}

// CountRecords returns number of records that match filter
func (dbobj C8DB) CountRecords(t Tbl, keyName string, keyValue string) (int64, error) {
	//	fmt.Println("*** CountRecords")

	// tbl := GetTable(t)
	// q := "select count(*) from " + tbl + " WHERE " + dbobj.escapeName(keyName) + "=$1"
	// //fmt.Printf("q: %s\n", q)

	// tx, err := dbobj.db.Begin()
	// if err != nil {
	// 	return 0, err
	// }
	// defer tx.Rollback()
	// row := tx.QueryRow(q, keyValue)
	// // Columns
	// var count int
	// err = row.Scan(&count)
	// if err != nil {
	// 	return 0, err
	// }
	// if err = tx.Commit(); err != nil {
	// 	return 0, err
	// }
	// return int64(count), nil
	return 0, nil
}

// UpdateRecord updates database record
func (dbobj C8DB) UpdateRecord(t Tbl, keyName string, keyValue string, bdoc *bson.M) (int64, error) {
	//fmt.Println("*** UpdateRecord")

	table := GetTable(t)
	if table == "agreementsupdate" || table == "agreements" {
		return 0, nil
	}

	q := "for doc in " + table +
		" filter doc." + keyName + " == '" + keyValue + "'" +
		" update { _key:doc._key } with {"

	var updateValues = ""
	for key, element := range *bdoc {
		updateValues = updateValues + key + ": '" + fmt.Sprintf("%v", element) + "',"
	}
	updateValues = strings.TrimSuffix(updateValues, ",")

	q = q + updateValues + "} in " + table

	query := "{\"bindvars\":{}, \"query\": \"" + q + "\"}"
	//fmt.Printf("q:%s\n", query)

	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(query))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)

	if !strings.Contains(resp.Status, "201") {
		fmt.Printf("UpdateRecord Table: %s\n", table)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}

	return 1, nil

	// filter := dbobj.escapeName(keyName) + "=\"" + keyValue + "\""
	// return dbobj.updateRecordInTableDo(table, filter, bdoc, nil)
}

// UpdateRecordInTable updates database record
func (dbobj C8DB) UpdateRecordInTable(table string, keyName string, keyValue string, bdoc *bson.M) (int64, error) {
	fmt.Println("*** UpdateRecordInTable")

	filter := dbobj.escapeName(keyName) + "=\"" + keyValue + "\""
	return dbobj.updateRecordInTableDo(table, filter, bdoc, nil)
}

// UpdateRecord2 updates database record
func (dbobj C8DB) UpdateRecord2(t Tbl, keyName string, keyValue string,
	keyName2 string, keyValue2 string, bdoc *bson.M, bdel *bson.M) (int64, error) {
	//fmt.Println("*** UpdateRecord2")

	table := GetTable(t)
	if table == "agreementsupdate" || table == "agreements" {
		return 0, nil
	}

	q := "for doc in " + table +
		" filter doc." + keyName + " == '" + keyValue + "' and doc." + keyName2 + " == '" + keyValue2 + "'" +
		" update { _key:doc._key } with {"

	var updateValues = ""
	for key, element := range *bdoc {
		updateValues = updateValues + key + ": '" + fmt.Sprintf("%v", element) + "',"
	}
	updateValues = strings.TrimSuffix(updateValues, ",")

	q = q + updateValues + "} in " + table

	query := "{\"bindvars\":{}, \"query\": \"" + q + "\"}"
	//fmt.Printf("q:%s\n", query)

	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(query))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)

	if !strings.Contains(resp.Status, "201") {
		fmt.Printf("UpdateRecord2 Table: %s\n", table)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}

	return 1, nil

	// filter := dbobj.escapeName(keyName) + "=\"" + keyValue + "\" AND " +
	// 	dbobj.escapeName(keyName2) + "=\"" + keyValue2 + "\""
	// return dbobj.updateRecordInTableDo(table, filter, bdoc, bdel)
}

// UpdateRecordInTable2 updates database record
func (dbobj C8DB) UpdateRecordInTable2(table string, keyName string,
	keyValue string, keyName2 string, keyValue2 string, bdoc *bson.M, bdel *bson.M) (int64, error) {
	fmt.Println("UpdateRecordInTable2")

	filter := dbobj.escapeName(keyName) + "=\"" + keyValue + "\" AND " +
		dbobj.escapeName(keyName2) + "=\"" + keyValue2 + "\""
	return dbobj.updateRecordInTableDo(table, filter, bdoc, bdel)
}

func (dbobj C8DB) updateRecordInTableDo(table string, filter string, bdoc *bson.M, bdel *bson.M) (int64, error) {
	fmt.Println("*** updateRecordInTableDo")

	op, values := dbobj.decodeForUpdate(bdoc, bdel)
	q := "update " + table + " SET " + op + " WHERE " + filter
	fmt.Printf("q: %s\n", q)

	tx, err := dbobj.db.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()
	result, err := tx.Exec(q, values...)
	if err != nil {
		return 0, err
	}
	if err = tx.Commit(); err != nil {
		return 0, err
	}
	num, err := result.RowsAffected()
	return num, err
}

// Lookup record by multiple fields
func (dbobj C8DB) LookupRecord(t Tbl, row bson.M) (bson.M, error) {
	fmt.Println("*** LookupRecord")

	table := GetTable(t)
	q := "select * from " + table + " WHERE "
	num := 1
	values := make([]interface{}, 0)
	for keyName, keyValue := range row {
		q = q + dbobj.escapeName(keyName) + "=$" + strconv.FormatInt(int64(num), 10)
		if num < len(row) {
			q = q + " AND "
		}
		values = append(values, keyValue)
		num = num + 1
	}
	return dbobj.getRecordInTableDo(q, values)
}

// GetRecord returns specific record from database
func (dbobj C8DB) GetRecord(t Tbl, keyName string, keyValue string) (bson.M, error) {
	//fmt.Printf("*** GetRecord: keyName: %s keyValue: %s\n", keyName, keyValue)

	table := GetTable(t)
	// q1 := "select * from " + table + " WHERE " + dbobj.escapeName(keyName) + "=$1"
	// fmt.Println(q1)
	q := "for doc in " + table + " filter doc." + keyName + " == @keyName return doc"

	type BindVarType struct {
		KeyName string `json:"keyName"`
	}

	type Query struct {
		BindVars    BindVarType `json:"bindVars"`
		QueryString string      `json:"query"`
	}
	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"
	bytes, err := json.Marshal(Query{
		QueryString: q,
		BindVars:    BindVarType{KeyName: keyValue}})

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(string(bytes)))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)
	if !strings.Contains(resp.Status, "201") {
		fmt.Printf("GetRecord Table: %s\n", table)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	//log.Printf("body:%s\n", body)

	var object map[string]json.RawMessage
	err = json.Unmarshal(body, &object)
	if err != nil {
		log.Fatal(err)
	}

	if len(object["result"]) == 0 {
		return nil, nil
	}

	var resultObject []interface{}
	err = json.Unmarshal(object["result"], &resultObject)
	if err != nil {
		log.Fatal(err)
	}

	if len(resultObject) == 0 {
		return nil, nil
	}

	recBson := bson.M{}

	for key, element := range resultObject[0].(map[string]interface{}) {
		if key == "_id" || key == "_key" || key == "_rev" {
			continue
		}
		recBson[key] = element
	}

	return recBson, nil
}

// GetRecordInTable returns specific record from database
func (dbobj C8DB) GetRecordInTable(table string, keyName string, keyValue string) (bson.M, error) {
	//fmt.Println("*** GetRecordInTable")

	q := "select * from " + table + " WHERE " + dbobj.escapeName(keyName) + "=$1"
	values := make([]interface{}, 0)
	values = append(values, keyValue)
	return dbobj.getRecordInTableDo(q, values)
}

// GetRecord2  returns specific record from database
func (dbobj C8DB) GetRecord2(t Tbl, keyName string, keyValue string,
	keyName2 string, keyValue2 string) (bson.M, error) {
	//log.Printf("*** GetRecord2: tbl:%d keyName: %s keyValue: %s keyName2: %s keyValue2:%s\n", t, keyName, keyValue, keyName2, keyValue2)

	table := GetTable(t)
	// q1 := "select * from " + table + " WHERE " + dbobj.escapeName(keyName) + "=$1 AND " +
	// 	dbobj.escapeName(keyName2) + "=$2"
	// fmt.Println(q1)
	q := "for doc in " + table + " filter doc." + keyName + " == @keyName and doc." + keyName2 + " == @keyName2 return doc"

	type BindVarType struct {
		KeyName  string `json:"keyName"`
		KeyName2 string `json:"keyName2"`
	}

	type Query struct {
		BindVars    BindVarType `json:"bindVars"`
		QueryString string      `json:"query"`
	}
	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"

	bytes, err := json.Marshal(Query{
		QueryString: q,
		BindVars: BindVarType{KeyName: keyValue,
			KeyName2: keyValue2}})

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(string(bytes)))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)
	if !strings.Contains(resp.Status, "200") {
		fmt.Printf("GetRecord2 Table: %s\n", table)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}

	return nil, nil
}

func (dbobj C8DB) getRecordInTableDo(q string, values []interface{}) (bson.M, error) {
	fmt.Printf("getRecordInTableDo: q:%s\n", q)

	fmt.Printf("query: %s\n", q)

	tx, err := dbobj.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	rows, err := tx.Query(q, values...)
	if err == sql.ErrNoRows {
		log.Println("nothing found")
		return nil, nil
	} else if err != nil {
		return nil, err
	}
	defer rows.Close()

	columnNames, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	//fmt.Printf("names: %s\n", columnNames)
	if err := rows.Err(); err != nil {
		return nil, err
	}
	//pointers := make([]interface{}, len(columnNames))
	recBson := bson.M{}
	rows.Next()
	columnPointers := make([]interface{}, len(columnNames))
	//for i, _ := range columnNames {
	//		columnPointers[i] = new(interface{})
	//}
	columns := make([]interface{}, len(columnNames))
	for idx := range columns {
		columnPointers[idx] = &columns[idx]
	}
	err = rows.Scan(columnPointers...)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		if strings.Contains(err.Error(), "Rows are closed") {
			return nil, nil
		}
		return nil, err
	}
	for i, colName := range columnNames {
		switch t := columns[i].(type) {
		case string:
			recBson[colName] = columns[i]
		case []uint8:
			recBson[colName] = string(columns[i].([]uint8))
		case int64:
			recBson[colName] = int32(columns[i].(int64))
		case int32:
			recBson[colName] = int32(columns[i].(int32))
		case bool:
			recBson[colName] = columns[i].(bool)
		case nil:
			//fmt.Printf("is nil, not interesting\n")
		default:
			log.Printf("field: %s - %s, unknown: %s - %T\n", colName, columns[i], t, t)
		}
	}
	err = rows.Close()
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}
	if len(recBson) == 0 {
		return nil, nil
	}
	tx.Commit()
	return recBson, nil
}

// DeleteRecord deletes record in database
func (dbobj C8DB) DeleteRecord(t Tbl, keyName string, keyValue string) (int64, error) {
	//fmt.Println("*** DeleteRecord")

	tbl := GetTable(t)

	q := "for doc in " + tbl +
		" filter doc." + keyName + " == '" + keyValue + "'" +
		" remove { _key: doc._key } in " + tbl

	//fmt.Printf("q:%s\n", q)
	query := "{\"bindvars\":{}, \"query\": \"" + q + "\"}"
	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(query))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)

	if !strings.Contains(resp.Status, "201") {
		fmt.Printf("DeleteRecord Table: %s\n", tbl)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}

	return 0, nil
	//return dbobj.DeleteRecordInTable(tbl, keyName, keyValue)
}

// DeleteRecordInTable deletes record in database
func (dbobj C8DB) DeleteRecordInTable(table string, keyName string, keyValue string) (int64, error) {
	fmt.Println("*** DeleteRecordInTable")

	q := "delete from " + table + " WHERE " + dbobj.escapeName(keyName) + "=$1"
	log.Printf("q: %s\n", q)

	tx, err := dbobj.db.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()
	result, err := tx.Exec(q, keyValue)
	if err != nil {
		return 0, err
	}
	if err = tx.Commit(); err != nil {
		return 0, err
	}
	num, err := result.RowsAffected()
	return num, err
}

// DeleteRecord2 deletes record in database
func (dbobj C8DB) DeleteRecord2(t Tbl, keyName string, keyValue string, keyName2 string, keyValue2 string) (int64, error) {
	fmt.Println("*** DeleteRecord2")

	tbl := GetTable(t)
	return dbobj.deleteRecordInTable2(tbl, keyName, keyValue, keyName2, keyValue2)
}

func (dbobj C8DB) deleteRecordInTable2(table string, keyName string, keyValue string, keyName2 string, keyValue2 string) (int64, error) {
	q := "delete from " + table + " WHERE " + dbobj.escapeName(keyName) + "=$1 AND " +
		dbobj.escapeName(keyName2) + "=$2"
	log.Printf("q: %s\n", q)

	tx, err := dbobj.db.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()
	result, err := tx.Exec(q, keyValue, keyValue2)
	if err != nil {
		return 0, err
	}
	if err = tx.Commit(); err != nil {
		return 0, err
	}
	num, err := result.RowsAffected()
	return num, err
}

// DeleteExpired0 deletes expired records in database
func (dbobj C8DB) DeleteExpired0(t Tbl, expt int32) (int64, error) {
	//fmt.Println("*** DeleteExpired0")
	return 0, nil

	// table := GetTable(t)
	// now := int32(time.Now().Unix())
	// q := fmt.Sprintf("delete from %s WHERE `when`>0 AND `when`<%d", table, now-expt)
	// log.Printf("q: %s\n", q)
	// tx, err := dbobj.db.Begin()
	// if err != nil {
	// 	return 0, err
	// }
	// defer tx.Rollback()
	// result, err := tx.Exec(q)
	// if err != nil {
	// 	return 0, err
	// }
	// if err = tx.Commit(); err != nil {
	// 	return 0, err
	// }
	// num, err := result.RowsAffected()
	// // vacuum database
	// dbobj.db.Exec("vacuum")
	// return num, err
}

// DeleteExpired deletes expired records in database
func (dbobj C8DB) DeleteExpired(t Tbl, keyName string, keyValue string) (int64, error) {
	//	fmt.Println("*** DBeDeleteExpiredxists")

	return 0, nil

	// table := GetTable(t)
	// q := "delete from " + table + " WHERE endtime>0 AND endtime<$1 AND " + dbobj.escapeName(keyName) + "=$2"
	// log.Printf("q: %s\n", q)

	// tx, err := dbobj.db.Begin()
	// if err != nil {
	// 	return 0, err
	// }
	// defer tx.Rollback()
	// now := int32(time.Now().Unix())
	// result, err := tx.Exec(q, now, keyValue)
	// if err != nil {
	// 	return 0, err
	// }
	// if err = tx.Commit(); err != nil {
	// 	return 0, err
	// }
	// num, err := result.RowsAffected()
	// return num, err
}

// CleanupRecord nullifies specific feilds in records in database
func (dbobj C8DB) CleanupRecord(t Tbl, keyName string, keyValue string, data interface{}) (int64, error) {
	//fmt.Println("*** CleanupRecord")

	tbl := GetTable(t)

	if tbl == "agreementsupdate" || tbl == "agreements" {
		return 0, nil
	}

	cleanup := dbobj.decodeForCleanup(data)

	q := "for doc in " + tbl +
		" filter doc." + keyName + " == '" + keyValue + "'" +
		" update { _key: doc._key} with {" + cleanup + "} into " + tbl

	query := "{\"bindvars\":{}, \"query\": \"" + q + "\"}"
	//fmt.Printf("query: %s\n", query)
	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(query))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//	debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)

	if !strings.Contains(resp.Status, "201") {
		fmt.Printf("CleanupRecord Table: %s\n", tbl)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}

	// cleanup := dbobj.decodeForCleanup(data)
	// q := "update " + tbl + " SET " + cleanup + " WHERE " + dbobj.escapeName(keyName) + "=$1"
	// log.Printf("q: %s\n", q)

	// tx, err := dbobj.db.Begin()
	// if err != nil {
	// 	return 0, err
	// }
	// defer tx.Rollback()
	// result, err := tx.Exec(q, keyValue)
	// if err != nil {
	// 	return 0, err
	// }
	// if err = tx.Commit(); err != nil {
	// 	return 0, err
	// }
	// num, err := result.RowsAffected()
	// return num, err

	return 0, nil
}

// GetExpiring get records that are expiring
func (dbobj C8DB) GetExpiring(t Tbl, keyName string, keyValue string) ([]bson.M, error) {
	//fmt.Println("*** GetExpiring")

	table := GetTable(t)
	//now := int32(time.Now().Unix())
	// q := "for doc in " + table + " filter doc.endtime > 0 and doc.endtime < " + strconv.FormatInt(int64(now), 10) + " and doc." + keyName + " == '" + keyValue + "'" +
	// 	" return doc"
	// We just going to expire always.  no delayed time as original API allowed.
	q := "for doc in " + table + " filter doc." + keyName + " == '" + keyValue + "'" +
		" return doc"
	//fmt.Printf("q: %s\n", q)

	query := "{\"bindvars\":{}, \"query\": \"" + q + "\"}"

	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/cursor"

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(query))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)
	if !strings.Contains(resp.Status, "201") {
		fmt.Printf("GetExpiring Table: %s\n", table)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	//log.Printf("body:%s\n", body)

	var object map[string]json.RawMessage
	err = json.Unmarshal(body, &object)
	if err != nil {
		log.Fatal(err)
	}

	if len(object["result"]) == 0 {
		return nil, nil
	}

	var resultObject []interface{}
	err = json.Unmarshal(object["result"], &resultObject)
	if err != nil {
		log.Fatal(err)
	}

	if len(resultObject) == 0 {
		return nil, nil
	}

	var results []bson.M

	for _, object := range(resultObject) {
		recBson := bson.M{}
		for key, element := range object.(map[string]interface{}) {
			if key == "_id" || key == "_key" || key == "_rev" {
				continue
			}
			recBson[key] = element
		}
		results = append(results, recBson)
	}

	return results, nil

	// return dbobj.getListDo(q, values)
}

// GetUniqueList returns a unique list of values from specific column in database
func (dbobj C8DB) GetUniqueList(t Tbl, keyName string) ([]bson.M, error) {
	fmt.Println("*** GetUniqueList")

	table := GetTable(t)
	keyName = dbobj.escapeName(keyName)
	q := "select distinct " + keyName + " from " + table + " ORDER BY " + keyName
	//fmt.Printf("q: %s\n", q)
	values := make([]interface{}, 0)
	return dbobj.getListDo(q, values)
}

// GetList is used to return list of rows. It can be used to return values using pager.
func (dbobj C8DB) GetList0(t Tbl, start int32, limit int32, orderField string) ([]bson.M, error) {
	fmt.Println("*** GetList0")

	table := GetTable(t)
	if limit > 100 {
		limit = 100
	}

	q := "select * from " + table
	if len(orderField) > 0 {
		q = q + " ORDER BY " + dbobj.escapeName(orderField) + " DESC"
	}
	if start > 0 {
		q = q + " LIMIT " + strconv.FormatInt(int64(limit), 10) +
			" OFFSET " + strconv.FormatInt(int64(start), 10)
	} else if limit > 0 {
		q = q + " LIMIT " + strconv.FormatInt(int64(limit), 10)
	}
	//fmt.Printf("q: %s\n", q)
	values := make([]interface{}, 0)
	return dbobj.getListDo(q, values)
}

// GetList is used to return list of rows. It can be used to return values using pager.
func (dbobj C8DB) GetList(t Tbl, keyName string, keyValue string, start int32, limit int32, orderField string) ([]bson.M, error) {

	table := GetTable(t)
	if limit > 100 {
		limit = 100
	}

	if table == "agreementsupdate" || table == "agreements" {
		return nil, nil
	}
	fmt.Println("*** GetList")

	q := "select * from " + table + " WHERE " + dbobj.escapeName(keyName) + "=$1"
	if len(orderField) > 0 {
		q = q + " ORDER BY " + dbobj.escapeName(orderField) + " DESC"
	}
	if start > 0 {
		q = q + " LIMIT " + strconv.FormatInt(int64(limit), 10) +
			" OFFSET " + strconv.FormatInt(int64(start), 10)
	} else if limit > 0 {
		q = q + " LIMIT " + strconv.FormatInt(int64(limit), 10)
	}
	fmt.Printf("q: %s\n", q)
	values := make([]interface{}, 0)
	values = append(values, keyValue)
	return dbobj.getListDo(q, values)
}

func (dbobj C8DB) getListDo(q string, values []interface{}) ([]bson.M, error) {
	tx, err := dbobj.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	rows, err := tx.Query(q, values...)
	if err == sql.ErrNoRows {
		log.Println("nothing found")
		return nil, nil
	} else if err != nil {
		return nil, err
	}
	defer rows.Close()

	columnNames, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	//fmt.Printf("names: %s\n", columnNames)
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	var results []bson.M
	//pointers := make([]interface{}, len(columnNames))
	//rows.Next()
	for rows.Next() {
		recBson := bson.M{}
		//fmt.Println("parsing result line")
		columnPointers := make([]interface{}, len(columnNames))
		//for i, _ := range columnNames {
		//		columnPointers[i] = new(interface{})
		//}
		columns := make([]interface{}, len(columnNames))
		for idx := range columns {
			columnPointers[idx] = &columns[idx]
		}

		err = rows.Scan(columnPointers...)
		if err == sql.ErrNoRows {
			return nil, nil
		}
		if err != nil {
			return nil, nil
		}
		for i, colName := range columnNames {
			switch t := columns[i].(type) {
			case string:
				recBson[colName] = columns[i]
			case []uint8:
				recBson[colName] = string(columns[i].([]uint8))
			case int64:
				recBson[colName] = int32(columns[i].(int64))
			case bool:
				recBson[colName] = columns[i].(bool)
			case nil:
				//fmt.Printf("is nil, not interesting\n")
			default:
				log.Printf("field: %s - %s, unknown: %s - %T\n", colName, columns[i], t, t)
			}
		}
		results = append(results, recBson)
	}
	err = rows.Close()
	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}
	if len(results) == 0 {
		return nil, nil
	}
	tx.Commit()
	return results, nil
}

// GetAllTables returns all tables that exists in database
func (dbobj C8DB) GetAllTables() ([]string, error) {
	//fmt.Println("*** GetAllTables")

	return knownApps2, nil
}

// ValidateNewApp function check if app name can be part of the table name
func (dbobj C8DB) ValidateNewApp(appName string) bool {
	//fmt.Println("*** ValidateNewApp")

	if contains(knownApps2, appName) == true {
		return true
	}
	return true
}

func (dbobj C8DB) execQueries(queries []string) error {
	for _, value2 := range queries {
		fmt.Printf("execQueries: %s", value2)
	}

	tx, err := dbobj.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	for _, value := range queries {
		_, err = tx.Exec(value)
		if err != nil {
			return err
		}
	}
	if err = tx.Commit(); err != nil {
		return err
	}
	return nil
}

// CreateNewAppTable creates a new app table and creates indexes for it.
func (dbobj C8DB) CreateNewAppTable(appName string) {
	//fmt.Println("*** CreateNewAppTable")

	if contains(knownApps2, appName) == false {
		// it is a new app, create an index
		log.Printf("This is a new app, creating table & index for: %s\n", appName)
		queries := []string{"CREATE TABLE IF NOT EXISTS " + appName + ` (
			token STRING,
			md5 STRING,
			rofields STRING,
			data TEXT,
			status STRING,
			` + "`when` int);",
			"CREATE INDEX " + appName + "_token ON " + appName + " (token);"}
		err := dbobj.execQueries(queries)
		if err == nil {
			knownApps2 = append(knownApps2, appName)
		}
	}
	return
}

func debug(data []byte, err error) {
	if err == nil {
		fmt.Printf("debug: %s\n\n", data)
	} else {
		log.Fatalf("debug: %s\n\n", err)
	}
}

func createCollection(collectionName string) {
	type Collection struct {
		Name string `json:"name"`
	}

	fmt.Printf("Creating collection %s", collectionName)

	var endpoint = getMMUrl() + "/_fabric/" + getMMFabric() + "/_api/collection"
	bytes, err := json.Marshal(Collection{Name: collectionName})

	client := &http.Client{}
	req, err := http.NewRequest("POST", endpoint, strings.NewReader(string(bytes)))
	req.Header.Add("Authorization", getMMApikey())
	req.Header.Add("accept", "application/json")
	req.Header.Add("Content-Type", "application/json")

	//debug(httputil.DumpRequest(req, true))

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	resp, _ := client.Do(req)
	if !strings.Contains(resp.Status, "200") {
		fmt.Printf("createCollection Table: %s\n", collectionName)
		debug(httputil.DumpRequest(req, true))
		debug(httputil.DumpResponse(resp, true))
	}
}

func (dbobj C8DB) initUsers() error {
	//fmt.Println("*** initUsers")

	createCollection("pii_users")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS users (
	// 		  token STRING,
	// 		  key STRING,
	// 		  md5 STRING,
	// 		  loginidx STRING,
	// 		  emailidx STRING,
	// 		  phoneidx STRING,
	// 		  customidx STRING,
	// 		  expstatus STRING,
	// 		  exptoken STRING,
	// 		  endtime int,
	// 		  tempcodeexp int,
	// 		  tempcode int,
	// 		  data TEXT
	// 		);`,
	// 	`CREATE INDEX users_token ON users (token);`,
	// 	`CREATE INDEX users_login ON users (loginidx);`,
	// 	`CREATE INDEX users_email ON users (emailidx);`,
	// 	`CREATE INDEX users_phone ON users (phoneidx);`,
	// 	`CREATE INDEX users_custom ON users (customidx);`,
	// 	`CREATE INDEX users_endtime ON users (endtime);`,
	// 	`CREATE INDEX users_exptoken ON users (exptoken);`}
	//return dbobj.execQueries(queries)
}

func (dbobj C8DB) initUserapps() error {
	//fmt.Println("*** initUserapps")

	createCollection("userapps")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS userapps (
	// 	appname STRING,
	// 	token STRING,
	// 	md5 STRING,
	// 	data TEXT,
	// 	status STRING,
	// 	` + "`when` int);",
	// 	"CREATE INDEX userapps_appname ON userapps (appname);",
	// 	"CREATE INDEX userapps_token_appname ON userapps (token,appname);"}
	// return dbobj.execQueries(queries)
}

func (dbobj C8DB) initXTokens() error {
	//fmt.Println("*** initXTokens")
	createCollection("xtokens")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS xtokens (
	// 			  xtoken STRING,
	// 			  token STRING,
	// 			  type STRING,
	// 			  app STRING,
	// 			  fields STRING,
	// 			  endtime int
	// 			);`,
	// 	`CREATE UNIQUE INDEX xtokens_xtoken ON xtokens (xtoken);`,
	// 	`CREATE INDEX xtokens_uniq ON xtokens (token, type);`}
	//return dbobj.execQueries(queries)
}

func (dbobj C8DB) initSharedRecords() error {
	//fmt.Println("*** initSharedRecords")
	createCollection("sharedrecords")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS sharedrecords (
	// 			  token STRING,
	// 			  record STRING,
	// 			  partner STRING,
	// 			  session STRING,
	// 			  app STRING,
	// 			  fields STRING,
	// 			  endtime int,
	// 			  ` + "`when` int);",
	// 	`CREATE INDEX sharedrecords_record ON sharedrecords (record);`}
	// return dbobj.execQueries(queries)
}

func (dbobj C8DB) initAudit() error {
	//fmt.Println("*** initAudit")
	createCollection("audit")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS audit (
	// 			  atoken STRING,
	// 			  identity STRING,
	// 			  record STRING,
	// 			  who STRING,
	// 			  mode STRING,
	// 			  app STRING,
	// 			  title STRING,
	// 			  status STRING,
	// 			  msg STRING,
	// 			  debug STRING,
	// 			  before TEXT,
	// 			  after TEXT,
	// 			  ` + "`when` int);",
	// 	`CREATE INDEX audit_atoken ON audit (atoken);`,
	// 	`CREATE INDEX audit_record ON audit (record);`}
	// return dbobj.execQueries(queries)
}

func (dbobj C8DB) initRequests() error {
	//fmt.Println("*** initRequests")
	createCollection("requests")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS requests (
	// 			  rtoken STRING,
	// 			  token STRING,
	// 			  app STRING,
	// 			  brief STRING,
	// 			  action STRING,
	// 			  status STRING,
	// 			  change STRING,
	// 			  reason STRING,
	// 			  creationtime int,
	// 			  ` + "`when` int);",
	// 	`CREATE INDEX requests_rtoken ON requests (rtoken);`,
	// 	`CREATE INDEX requests_token ON requests (token);`,
	// 	`CREATE INDEX requests_status ON requests (status);`}
	// return dbobj.execQueries(queries)
}

func (dbobj C8DB) initProcessingactivities() error {
	//fmt.Println("*** initProcessingactivities")
	createCollection("processingactivities")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS processingactivities (
	// 			  activity STRING,
	// 			  title STRING,
	// 			  script STRING,
	// 			  fulldesc STRING,
	// 			  legalbasis STRING,
	// 			  applicableto STRING,
	// 			  creationtime int);`,
	// 	`CREATE INDEX processingactivities_activity ON processingactivities (activity);`}
	//return dbobj.execQueries(queries)
}

func (dbobj C8DB) initLegalbasis() error {
	//fmt.Println("*** initLegalbasis")
	createCollection("legalbasis")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS legalbasis (
	// 			  brief STRING,
	// 			  status STRING,
	// 			  module STRING,
	// 			  shortdesc STRING,
	// 			  fulldesc STRING,
	// 			  basistype STRING,
	// 			  requiredmsg STRING,
	// 			  usercontrol BOOLEAN,
	// 			  requiredflag BOOLEAN,
	// 			  creationtime int);`,
	// 	`CREATE INDEX legalbasis_brief ON legalbasis (brief);`}
	// return dbobj.execQueries(queries)
}

func (dbobj C8DB) initAgreements() error {
	//fmt.Println("*** initAgreements")
	createCollection("agreements")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS agreements (
	// 			  who STRING,
	// 			  mode STRING,
	// 			  token STRING,
	// 			  brief STRING,
	// 			  status STRING,
	// 			  referencecode STRING,
	// 			  lastmodifiedby STRING,
	// 			  agreementmethod STRING,
	// 			  creationtime int,
	// 			  starttime int,
	// 			  endtime int,
	// 			  ` + "`when` int);",
	// 	`CREATE INDEX agreements_token ON agreements (token);`,
	// 	`CREATE INDEX agreements_brief ON agreements (brief);`}
	// return dbobj.execQueries(queries)
}

func (dbobj C8DB) initSessions() error {
	//fmt.Println("*** initSessions")
	createCollection("sessions")
	return nil

	// queries := []string{`CREATE TABLE IF NOT EXISTS sessions (
	// 			  token STRING,
	// 			  session STRING,
	// 			  key STRING,
	// 			  data TEXT,
	// 			  endtime int,
	// 			  ` + "`when` int);",
	// 	`CREATE INDEX sessions_token ON sessions (token);`,
	// 	`CREATE INDEX sessions_session ON sessions (session);`}
	// return dbobj.execQueries(queries)
}
