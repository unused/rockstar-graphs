package main

import (
	"gotwt"
	"log"
	"os"
	"strings"
)

func main() {
	apiKey := os.Getenv("API_KEY")
	apiSecret := os.Getenv("API_SECRET")
	accessToken := os.Getenv("ACCESS_TOKEN")
	accessSecret := os.Getenv("ACCESS_TOKEN_SECRET")

	if apiKey == "" || apiSecret == "" {
		log.Fatal("Consumer API keys missing")
	}

	if accessToken == "" || accessSecret == "" {
		log.Fatal("Access keys missing")
	}

	client := gotwt.New(apiKey, apiSecret, accessToken, accessSecret)
	queries := strings.Split(strings.Join(os.Args[1:], ""), ",")

	log.Println("Number of queries:", len(queries))
	finished := make(chan bool)
	for _, query := range queries {
		filename := query + ".jsonl"
		go client.Listen("@"+query+" OR #"+query, filename)
	}
	<-finished
}
