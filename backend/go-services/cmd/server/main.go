package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

type HealthResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
	Version string `json:"version"`
}

type APIResponse struct {
	Status string                 `json:"status"`
	Data   map[string]interface{} `json:"data"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(HealthResponse{
		Status:  "healthy",
		Service: "friendapp-go-services",
		Version: "1.0.0",
	})
}

func metricsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(APIResponse{
		Status: "success",
		Data: map[string]interface{}{
			"message": "Performance metrics endpoint - to be implemented",
		},
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9000"
	}

	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/api/v1/performance/metrics", metricsHandler)

	log.Printf("FriendApp Go Services running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
