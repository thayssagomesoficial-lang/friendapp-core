package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

type RiskCalculationRequest struct {
	UserID                 string  `json:"user_id" binding:"required"`
	TempoResposta          float64 `json:"tempo_resposta"`
	LinguagemNegativa      bool    `json:"linguagem_negativa"`
	InconsistenciaEscolhas bool    `json:"inconsistencia_escolhas"`
	VerificadoDUC          bool    `json:"verificado_duc"`
	DenunciasValidadas     int     `json:"denuncias_validadas"`
}

type RiskResponse struct {
	UserID       string  `json:"user_id"`
	ScoreRisco   float64 `json:"score_risco"`
	NivelRisco   string  `json:"nivel_risco"`
	Blindagem    string  `json:"blindagem"`
	Cor          string  `json:"cor"`
	Frequencia   string  `json:"frequencia"`
	FeedbackIA   string  `json:"feedback_ia"`
}

func main() {
	godotenv.Load()

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgres://postgres:postgres@localhost:5432/friendapp?sslmode=disable"
	}

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	createTables()

	r := gin.Default()

	r.GET("/health", healthCheck)
	r.POST("/api/seguranca/calcular-risco", calcularRisco)
	r.GET("/api/seguranca/usuario/:userId", obterStatusSeguranca)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3007"
	}

	log.Printf("Seguranca Vibracional Service running on port %s", port)
	r.Run(":" + port)
}

func createTables() {
	query := `
	CREATE TABLE IF NOT EXISTS security_events (
		id SERIAL PRIMARY KEY,
		user_id UUID NOT NULL,
		event_type VARCHAR(50),
		risk_score FLOAT,
		shield_activated VARCHAR(20),
		variables JSONB,
		action_taken VARCHAR(100),
		timestamp TIMESTAMP DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS user_trust_level (
		user_id UUID PRIMARY KEY,
		trust_score INT CHECK (trust_score >= 0 AND trust_score <= 100),
		shield_history JSONB,
		last_incident TIMESTAMP,
		updated_at TIMESTAMP DEFAULT NOW()
	);
	`

	_, err := db.Exec(query)
	if err != nil {
		log.Printf("Error creating tables: %v", err)
	} else {
		log.Println("Tables created successfully")
	}
}

func healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"status":  "healthy",
		"service": "seguranca-vibracional-service",
	})
}

func calcularRisco(c *gin.Context) {
	var req RiskCalculationRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	w1 := 0.15
	w2 := 0.30
	w3 := 0.25
	w4 := 0.20
	w5 := 0.40

	tempoNorm := normalizeTempoResposta(req.TempoResposta)
	linguagemNorm := 0.0
	if req.LinguagemNegativa {
		linguagemNorm = 1.0
	}
	inconsistenciaNorm := 0.0
	if req.InconsistenciaEscolhas {
		inconsistenciaNorm = 1.0
	}
	ducReduction := 0.0
	if req.VerificadoDUC {
		ducReduction = 0.3
	}
	denunciasNorm := float64(req.DenunciasValidadas) * 0.1
	if denunciasNorm > 1.0 {
		denunciasNorm = 1.0
	}

	scoreRisco := (w1 * tempoNorm) +
		(w2 * linguagemNorm) +
		(w3 * inconsistenciaNorm) -
		(w4 * ducReduction) +
		(w5 * denunciasNorm)

	if scoreRisco < 0 {
		scoreRisco = 0
	}
	if scoreRisco > 1 {
		scoreRisco = 1
	}

	nivel, blindagem, cor, freq, feedback := determinarNivelRisco(scoreRisco)

	query := `
	INSERT INTO security_events (user_id, event_type, risk_score, shield_activated, action_taken)
	VALUES ($1, 'risk_calculation', $2, $3, $4)
	`
	_, err := db.Exec(query, req.UserID, scoreRisco, blindagem, feedback)
	if err != nil {
		log.Printf("Error saving security event: %v", err)
	}

	response := RiskResponse{
		UserID:     req.UserID,
		ScoreRisco: scoreRisco,
		NivelRisco: nivel,
		Blindagem:  blindagem,
		Cor:        cor,
		Frequencia: freq,
		FeedbackIA: feedback,
	}

	c.JSON(200, response)
}

func normalizeTempoResposta(tempo float64) float64 {
	if tempo < 1.0 || tempo > 30.0 {
		return 0.8
	}
	return 0.1
}

func determinarNivelRisco(score float64) (string, string, string, string, string) {
	if score < 0.4 {
		return "baixo", "leve", "azul_claro", "528Hz", "Seu campo está oscilando, vamos suavizar sua experiência."
	} else if score >= 0.4 && score < 0.75 {
		return "moderado", "moderada", "lilás", "432Hz", "Percebemos instabilidade, sua timeline ficará mais calma."
	} else {
		return "grave", "grave", "azul_escuro", "396Hz", "Sua segurança está em prioridade, ajustamos conexões."
	}
}

func obterStatusSeguranca(c *gin.Context) {
	userId := c.Param("userId")

	var trustScore int
	var lastIncident sql.NullTime

	query := `SELECT trust_score, last_incident FROM user_trust_level WHERE user_id = $1`
	err := db.QueryRow(query, userId).Scan(&trustScore, &lastIncident)

	if err == sql.ErrNoRows {
		c.JSON(404, gin.H{"error": "Usuário não encontrado"})
		return
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Erro ao buscar dados"})
		return
	}

	c.JSON(200, gin.H{
		"user_id":       userId,
		"trust_score":   trustScore,
		"last_incident": lastIncident,
	})
}
