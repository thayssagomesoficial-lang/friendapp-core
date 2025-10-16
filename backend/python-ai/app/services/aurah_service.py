import numpy as np
from typing import Dict, List, Any
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class AurahKosmosService:
    """
    IA Aurah Kosmos - 10 primeiras camadas de processamento
    Sistema de IA vibracional para análise de compatibilidade e ressonância
    """
    
    def __init__(self):
        self.layers = {
            1: "Análise de Intenção Consciente",
            2: "Processamento de Vetor Energético",
            3: "Compatibilidade de Personalidade",
            4: "Análise de Frequência Vibracional",
            5: "Matching Contextual",
            6: "Predição de Ressonância",
            7: "Análise de Padrões Emocionais",
            8: "Sincronicidade Temporal",
            9: "Geolocalização Vibracional",
            10: "Score de Confiança Holístico"
        }
    
    async def process_personality(self, user_id: str, energy_vector: Dict, personality_type: str) -> Dict[str, Any]:
        """Layer 1-3: Processa personalidade e cria embeddings vibracionais"""
        logger.info(f"Processing personality for user {user_id}")
        
        intention_embedding = self._analyze_intention(energy_vector)
        
        energy_embedding = self._process_energy_vector(energy_vector)
        
        personality_traits = self._extract_personality_traits(personality_type, energy_vector)
        
        return {
            "user_id": user_id,
            "intention_embedding": intention_embedding.tolist(),
            "energy_embedding": energy_embedding.tolist(),
            "personality_traits": personality_traits,
            "processed_at": datetime.utcnow().isoformat(),
        }
    
    async def analyze_post(self, post_id: str, content: str, emotion_tone: str, user_id: str) -> Dict[str, Any]:
        """Layer 4-7: Analisa post e extrai características vibracionais"""
        logger.info(f"Analyzing post {post_id}")
        
        frequency_analysis = self._analyze_frequency(emotion_tone)
        
        emotional_patterns = self._extract_emotional_patterns(content, emotion_tone)
        
        resonance_potential = self._calculate_resonance_potential(frequency_analysis, emotional_patterns)
        
        return {
            "post_id": post_id,
            "frequency_level": frequency_analysis["frequency"],
            "emotional_signature": emotional_patterns,
            "resonance_potential": resonance_potential,
            "analyzed_at": datetime.utcnow().isoformat(),
        }
    
    async def calculate_compatibility(self, user1_id: str, user2_id: str, 
                                     user1_data: Dict, user2_data: Dict) -> Dict[str, Any]:
        """Layer 8-10: Calcula compatibilidade holística entre usuários"""
        logger.info(f"Calculating compatibility between {user1_id} and {user2_id}")
        
        energy_alignment = self._calculate_energy_alignment(
            user1_data.get("energy_vector", {}),
            user2_data.get("energy_vector", {})
        )
        
        intention_match = self._calculate_intention_match(
            user1_data.get("conscious_intention", ""),
            user2_data.get("conscious_intention", "")
        )
        
        temporal_sync = self._analyze_temporal_synchronicity(user1_data, user2_data)
        
        geo_resonance = self._calculate_geo_resonance(
            user1_data.get("location", {}),
            user2_data.get("location", {})
        )
        
        holistic_score = self._calculate_holistic_score(
            energy_alignment, intention_match, temporal_sync, geo_resonance
        )
        
        return {
            "user1_id": user1_id,
            "user2_id": user2_id,
            "energy_alignment": energy_alignment,
            "intention_match": intention_match,
            "temporal_synchronicity": temporal_sync,
            "geo_resonance": geo_resonance,
            "holistic_compatibility_score": holistic_score,
            "confidence_level": self._calculate_confidence(holistic_score),
            "calculated_at": datetime.utcnow().isoformat(),
        }
    
    async def learn_interaction(self, user_id: str, post_id: str, 
                               interaction_type: str, duration_seconds: int = None) -> Dict[str, Any]:
        """Aprendizado contínuo baseado em interações"""
        logger.info(f"Learning from interaction: {user_id} -> {post_id} ({interaction_type})")
        
        engagement_weight = {
            "like": 0.3,
            "view": 0.1,
            "share": 0.5,
            "save": 0.4,
        }.get(interaction_type, 0.1)
        
        if duration_seconds:
            engagement_weight *= min(duration_seconds / 30.0, 2.0)
        
        return {
            "user_id": user_id,
            "post_id": post_id,
            "engagement_weight": engagement_weight,
            "learned_at": datetime.utcnow().isoformat(),
        }
    
    def _analyze_intention(self, energy_vector: Dict) -> np.ndarray:
        """Layer 1: Analisa intenção consciente"""
        dimensions = energy_vector.get("dimensions", {})
        intention_vector = np.array([
            dimensions.get("solar", 0),
            dimensions.get("lunar", 0),
            dimensions.get("etereo", 0),
            dimensions.get("aquatico", 0),
        ])
        return intention_vector / (np.linalg.norm(intention_vector) + 1e-8)
    
    def _process_energy_vector(self, energy_vector: Dict) -> np.ndarray:
        """Layer 2: Processa vetor energético completo"""
        dimensions = energy_vector.get("dimensions", {})
        vector = np.array([
            dimensions.get("solar", 0),
            dimensions.get("lunar", 0),
            dimensions.get("terrestre", 0),
            dimensions.get("aereo", 0),
            dimensions.get("aquatico", 0),
            dimensions.get("igneo", 0),
            dimensions.get("etereo", 0),
        ])
        return vector / (np.linalg.norm(vector) + 1e-8)
    
    def _extract_personality_traits(self, personality_type: str, energy_vector: Dict) -> Dict:
        """Layer 3: Extrai traços de personalidade"""
        dimensions = energy_vector.get("dimensions", {})
        return {
            "type": personality_type,
            "openness": dimensions.get("aereo", 0) + dimensions.get("etereo", 0),
            "conscientiousness": dimensions.get("terrestre", 0),
            "extraversion": dimensions.get("solar", 0) + dimensions.get("igneo", 0),
            "agreeableness": dimensions.get("aquatico", 0),
            "emotional_stability": dimensions.get("lunar", 0),
        }
    
    def _analyze_frequency(self, emotion_tone: str) -> Dict:
        """Layer 4: Analisa frequência vibracional"""
        frequency_map = {
            "amor": 528,
            "gratidao": 540,
            "alegria": 500,
            "paz": 600,
            "inspiracao": 480,
            "curiosidade": 450,
            "reflexao": 420,
            "transformacao": 470,
        }
        return {
            "frequency": frequency_map.get(emotion_tone, 440),
            "tone": emotion_tone,
        }
    
    def _extract_emotional_patterns(self, content: str, emotion_tone: str) -> Dict:
        """Layer 7: Extrai padrões emocionais do conteúdo"""
        word_count = len(content.split())
        
        positive_words = ["amor", "gratidão", "alegria", "paz", "luz", "feliz", "felicidade", "abundância"]
        positive_count = sum(1 for word in positive_words if word.lower() in content.lower())
        
        return {
            "emotion_tone": emotion_tone,
            "positivity_ratio": positive_count / max(word_count, 1),
            "content_length": len(content),
            "word_count": word_count,
        }
    
    def _calculate_resonance_potential(self, frequency: Dict, patterns: Dict) -> float:
        """Layer 6: Calcula potencial de ressonância"""
        base_resonance = frequency["frequency"] / 1000.0
        emotional_boost = patterns["positivity_ratio"] * 0.3
        return min(base_resonance + emotional_boost, 1.0)
    
    def _calculate_energy_alignment(self, vector1: Dict, vector2: Dict) -> float:
        """Calcula alinhamento energético entre dois usuários"""
        if not vector1 or not vector2:
            return 0.5
        
        dims1 = vector1.get("dimensions", {})
        dims2 = vector2.get("dimensions", {})
        
        v1 = np.array([dims1.get(k, 0) for k in ["solar", "lunar", "terrestre", "aereo", "aquatico", "igneo", "etereo"]])
        v2 = np.array([dims2.get(k, 0) for k in ["solar", "lunar", "terrestre", "aereo", "aquatico", "igneo", "etereo"]])
        
        if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
            return 0.5
        
        cosine_sim = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
        return (cosine_sim + 1) / 2
    
    def _calculate_intention_match(self, intention1: str, intention2: str) -> float:
        """Layer 1: Calcula match de intenção consciente"""
        if not intention1 or not intention2:
            return 0.5
        
        words1 = set(intention1.lower().split())
        words2 = set(intention2.lower().split())
        
        if not words1 or not words2:
            return 0.5
        
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        return intersection / union if union > 0 else 0.5
    
    def _analyze_temporal_synchronicity(self, user1: Dict, user2: Dict) -> float:
        """Layer 8: Analisa sincronicidade temporal"""
        return 0.7
    
    def _calculate_geo_resonance(self, loc1: Dict, loc2: Dict) -> float:
        """Layer 9: Calcula ressonância geográfica"""
        if not loc1 or not loc2:
            return 0.5
        
        if loc1.get("city") == loc2.get("city"):
            return 0.9
        elif loc1.get("state") == loc2.get("state"):
            return 0.7
        elif loc1.get("country") == loc2.get("country"):
            return 0.5
        else:
            return 0.3
    
    def _calculate_holistic_score(self, energy: float, intention: float, 
                                  temporal: float, geo: float) -> float:
        """Layer 10: Score holístico final"""
        weights = {
            "energy": 0.35,
            "intention": 0.35,
            "temporal": 0.15,
            "geo": 0.15,
        }
        
        score = (
            energy * weights["energy"] +
            intention * weights["intention"] +
            temporal * weights["temporal"] +
            geo * weights["geo"]
        )
        
        return round(score, 3)
    
    def _calculate_confidence(self, holistic_score: float) -> str:
        """Calcula nível de confiança"""
        if holistic_score >= 0.8:
            return "muito_alta"
        elif holistic_score >= 0.6:
            return "alta"
        elif holistic_score >= 0.4:
            return "media"
        else:
            return "baixa"
