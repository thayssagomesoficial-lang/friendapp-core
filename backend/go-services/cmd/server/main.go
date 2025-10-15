package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "9000"
	}

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "friendapp-go-services",
			"version": "1.0.0",
		})
	})

	api := r.Group("/api/v1")
	{
		api.GET("/performance/metrics", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status": "success",
				"data": gin.H{
					"message": "Performance metrics endpoint - to be implemented",
				},
			})
		})
	}

	log.Printf("FriendApp Go Services running on port %s", port)
	r.Run(":" + port)
}
