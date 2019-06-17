package gotwt

import (
	"encoding/json"
	"fmt"
	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	"log"
	"os"
	"time"
)

type Client struct {
	api *twitter.Client
}

// New initializes a new client.
func New(apiKey string, apiSecret string, accessToken string, accessSecret string) Client {
	config := oauth1.NewConfig(apiKey, apiSecret)
	token := oauth1.NewToken(accessToken, accessSecret)
	httpClient := config.Client(oauth1.NoContext, token)
	return Client{twitter.NewClient(httpClient)}
}

// Listen for new tweets by the given query and write results to destination.
func (client *Client) Listen(query string, filename string) {
	log.Println("Search query:", query)
	var maxID int64 = 0

	for {
		search, _, err := client.api.Search.Tweets(&twitter.SearchTweetParams{
			Query:      query,
			MaxID:      maxID,
			Count:      100,
			ResultType: "recent",
			Filter:     "safe",
		})

		if err != nil {
			log.Fatal("Error while searching", err)
		}

		statusCount := len(search.Statuses)
		if statusCount == 0 {
			log.Println("No results for", query, "going to rest for 5 minutes")
			time.Sleep(5 * time.Minute)
			continue
		}

		maxID = search.Statuses[statusCount-1].ID - 1
		log.Println("Updated max-id to", maxID)

		log.Println("Write", len(search.Statuses), "tweets for", query)
		results, err := json.Marshal(search)

		if err != nil {
			log.Fatal("Failed to build tweets JSON", err)
		}

		write(string(results), filename)
	}
}

func write(content string, filename string) {
	file, err := os.OpenFile(filename, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0644)
	if err != nil {
		log.Fatal("Could not open file", filename)
	}
	defer file.Close()

	_, err = fmt.Fprintln(file, content)
	if err != nil {
		log.Fatal("Failed to write newline", err)
	}
}
