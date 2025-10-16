package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

var (
	db  *sql.DB
	rdb *redis.Client
	ctx = context.Background()
)

type PerformanceMetrics struct {
	RequestsPerSecond float64            `json:"requests_per_second"`
	AverageLatency    float64            `json:"average_latency_ms"`
	CacheHitRate      float64            `json:"cache_hit_rate"`
	ActiveConnections int                `json:"active_connections"`
	Timestamp         time.Time          `json:"timestamp"`
	DetailedMetrics   map[string]float64 `json:"detailed_metrics"`
}

type ConnectionScore struct {
	UserID1           string    `json:"user_id_1"`
	UserID2           string    `json:"user_id_2"`
	CompatibilityScore float64  `json:"compatibility_score"`
	CalculatedAt      time.Time `json:"calculated_at"`
}

func initDB() error {
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	connStr := "host=" + dbHost + " port=" + dbPort + " user=" + dbUser + 
		" password=" + dbPassword + " dbname=" + dbName + " sslmode=disable"

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	return db.Ping()
}

func initRedis() error {
	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisHost + ":" + redisPort,
		Password: "",
		DB:       0,
	})

	return rdb.Ping(ctx).Err()
}

func healthHandler(c *gin.Context) {
	dbErr := db.Ping()
	redisErr := rdb.Ping(ctx).Err()

	status := "healthy"
	statusCode := http.StatusOK

	if dbErr != nil || redisErr != nil {
		status = "unhealthy"
		statusCode = http.StatusServiceUnavailable
	}

	c.JSON(statusCode, gin.H{
		"status":    status,
		"service":   "friendapp-go-services",
		"timestamp": time.Now().Unix(),
		"checks": gin.H{
			"database": dbErr == nil,
			"redis":    redisErr == nil,
		},
	})
}

func metricsHandler(c *gin.Context) {
	metrics := PerformanceMetrics{
		RequestsPerSecond: calculateRPS(),
		AverageLatency:    calculateAvgLatency(),
		CacheHitRate:      calculateCacheHitRate(),
		ActiveConnections: db.Stats().OpenConnections,
		Timestamp:         time.Now(),
		DetailedMetrics: map[string]float64{
			"db_idle_connections": float64(db.Stats().Idle),
			"db_in_use":           float64(db.Stats().InUse),
			"db_wait_count":       float64(db.Stats().WaitCount),
		},
	}

	c.JSON(http.StatusOK, metrics)
}

func calculateRPS() float64 {
	cacheKey := "metrics:rps:current"
	val, err := rdb.Get(ctx, cacheKey).Result()
	if err != nil {
		return 0.0
	}

	var rps float64
	json.Unmarshal([]byte(val), &rps)
	return rps
}

func calculateAvgLatency() float64 {
	cacheKey := "metrics:latency:avg"
	val, err := rdb.Get(ctx, cacheKey).Result()
	if err != nil {
		return 0.0
	}

	var latency float64
	json.Unmarshal([]byte(val), &latency)
	return latency
}

func calculateCacheHitRate() float64 {
	info, err := rdb.Info(ctx, "stats").Result()
	if err != nil {
		return 0.0
	}

	_ = info
	return 0.85 // Placeholder - implementar parsing real
}

func calculateCompatibilityHandler(c *gin.Context) {
	var request struct {
		UserID1 string `json:"user_id_1" binding:"required"`
		UserID2 string `json:"user_id_2" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cacheKey := "compatibility:" + request.UserID1 + ":" + request.UserID2
	cached, err := rdb.Get(ctx, cacheKey).Result()
	if err == nil {
		var score ConnectionScore
		json.Unmarshal([]byte(cached), &score)
		c.JSON(http.StatusOK, gin.H{
			"cached": true,
			"score":  score,
		})
		return
	}

	score := calculateCompatibilityScore(request.UserID1, request.UserID2)

	scoreJSON, _ := json.Marshal(score)
	rdb.Set(ctx, cacheKey, scoreJSON, time.Hour)

	c.JSON(http.StatusOK, gin.H{
		"cached": false,
		"score":  score,
	})
}

func calculateCompatibilityScore(userID1, userID2 string) ConnectionScore {
	
	score := ConnectionScore{
		UserID1:            userID1,
		UserID2:            userID2,
		CompatibilityScore: 0.75, // Placeholder
		CalculatedAt:       time.Now(),
	}

	return score
}

func batchProcessHandler(c *gin.Context) {
	var request struct {
		UserIDs []string `json:"user_ids" binding:"required"`
		Action  string   `json:"action" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	batchID := uuid.New().String()

	go processBatch(batchID, request.UserIDs, request.Action)

	c.JSON(http.StatusAccepted, gin.H{
		"batch_id": batchID,
		"status":   "processing",
		"count":    len(request.UserIDs),
	})
}

func processBatch(batchID string, userIDs []string, action string) {
	log.Printf("Processing batch %s with %d users, action: %s", batchID, len(userIDs), action)

	rdb.Set(ctx, "batch:"+batchID+":status", "completed", 24*time.Hour)
}

func getBatchStatusHandler(c *gin.Context) {
	batchID := c.Param("batch_id")

	status, err := rdb.Get(ctx, "batch:"+batchID+":status").Result()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Batch not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"batch_id": batchID,
		"status":   status,
	})
}

func main() {
	godotenv.Load()

	if err := initDB(); err != nil {
		log.Printf("Warning: Database connection failed: %v", err)
	} else {
		log.Println("✓ PostgreSQL connected")
	}

	if err := initRedis(); err != nil {
		log.Printf("Warning: Redis connection failed: %v", err)
	} else {
		log.Println("✓ Redis connected")
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	r.GET("/health", healthHandler)
	r.GET("/api/v1/performance/metrics", metricsHandler)
	r.POST("/api/v1/performance/compatibility", calculateCompatibilityHandler)
	r.POST("/api/v1/performance/batch", batchProcessHandler)
	r.GET("/api/v1/performance/batch/:batch_id", getBatchStatusHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "9000"
	}

	log.Printf("🚀 FriendApp Go Services running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
