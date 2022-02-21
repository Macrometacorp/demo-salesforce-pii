package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func debug(data []byte, err error) {
	if err == nil {
		fmt.Printf("%s\n\n", data)
	} else {
		fmt.Printf("%s\n\n", err)
		//log.Fatalf("%s\n\n", err)
	}
}

type mmkey struct {
	Error  bool `json:"error"`
	Code   int  `json:"code"`
	Result []struct {
		Keyid  string `json:"keyid"`
		User   string `json:"user"`
		Tenant string `json:"tenant"`
	} `json:"result"`
}

func main() {
	var apikey = "apikey joubert_databunker.com.databunkerDemo.VpT4zqdTT5qz4PycrDW2ItXFYGgcX8FOVJljFlEI3tMBAP7lnQBBoL3zgqRIlfuKf15116"
	url := "https://api-joubert-us-east.eng.macrometa.io/_api/key"

	req, err := http.NewRequest("GET", url, nil)
	req.Header.Add("Authorization", apikey)
	req.Header.Add("accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		fmt.Printf("%s\n\n", err)
		log.Fatalln(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	//Convert the body to type string
	fmt.Println(string(body))

	jsonMap := &mmkey{}
	err2 := json.Unmarshal(body, jsonMap)
	if err2 != nil {
		log.Fatal(err2)
	}

	fmt.Printf("%v\n", jsonMap)
	fmt.Printf("error=%t\n", jsonMap.Error)
	fmt.Printf("code=%d\n", jsonMap.Code)
	fmt.Printf("keyid=%s\n", jsonMap.Result[0].Keyid)
}
