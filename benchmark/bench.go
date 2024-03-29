package main

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"

	uuid "github.com/satori/go.uuid"
)

var totalRequests int

func updateTotalRequests(mu *sync.Mutex) {
	mu.Lock()
	defer mu.Unlock()
	totalRequests++
}

func Benchmark() error {
	API_HOST := os.Getenv("API_HOST")

	if API_HOST == "" {
		API_HOST = "http://localhost:8000/"
	}

	_, err := net.DialTimeout("tcp", API_HOST, 1*time.Second)
	if err != nil {
		fmt.Println("Error running benchmark. Service API not reachable", err.Error())
		os.Exit(0)
	}

	MAX_GO_ROUTINES, _ := strconv.Atoi(os.Getenv("MAX_GO_ROUTINES"))
	
	if MAX_GO_ROUTINES == 0 {
		MAX_GO_ROUTINES = 1
	}

	fmt.Println("Spawning ", MAX_GO_ROUTINES, " go routines...")

	for i:=0; i < MAX_GO_ROUTINES; i++ {
		go func() {
			for {
				randomId := uuid.NewV4().String()
				url := fmt.Sprintf(API_HOST + "v1.0/users?userId=%s", randomId)
				resp, err := http.Get(url)
				if err != nil {
					fmt.Println(err)
				}
				defer resp.Body.Close()

				userStruct := struct {
					UserId string `json:"userId"`
				}{}

				if resp.StatusCode == 200 {
					json.NewDecoder(resp.Body).Decode(&userStruct)
					if userStruct.UserId != randomId {
						fmt.Println("Error: ", userStruct.UserId, randomId)
						os.Exit(0)
					}
					updateTotalRequests(&sync.Mutex{})
				}
			}
		}()
	}

	go func() {
		for {
			fmt.Printf("\rTotal: %d", totalRequests)
		}
	}()

	return nil
}