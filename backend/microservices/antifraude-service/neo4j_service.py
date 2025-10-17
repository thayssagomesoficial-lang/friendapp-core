from neo4j import GraphDatabase
import logging
from typing import List

logger = logging.getLogger(__name__)

class Neo4jService:
    def __init__(self, uri, user, password):
        try:
            self.driver = GraphDatabase.driver(uri, auth=(user, password))
            logger.info("Neo4j connected successfully")
        except Exception as e:
            logger.error(f"Neo4j connection error: {e}")
            self.driver = None
    
    def close(self):
        if self.driver:
            self.driver.close()
    
    def criar_interacao(self, user_id_origem, user_id_destino, tipo_interacao, valor=None):
        if not self.driver:
            return
        
        with self.driver.session() as session:
            session.run("""
                MERGE (u1:User {id: $origem})
                MERGE (u2:User {id: $destino})
                CREATE (u1)-[:INTERAGE_COM {
                    tipo: $tipo, 
                    valor: $valor, 
                    timestamp: datetime()
                }]->(u2)
            """, origem=user_id_origem, destino=user_id_destino, 
                tipo=tipo_interacao, valor=valor)
    
    def detectar_clusters_fechados(self, user_id) -> List:
        if not self.driver:
            return []
        
        with self.driver.session() as session:
            result = session.run("""
                MATCH (u:User {id: $user_id})-[r:INTERAGE_COM]->(v:User)
                WITH u, collect(v) as grupo
                WHERE size(grupo) >= 2 AND size(grupo) <= 5
                RETURN grupo
            """, user_id=user_id)
            
            clusters = []
            for record in result:
                if record["grupo"]:
                    clusters.append([node["id"] for node in record["grupo"]])
            
            return clusters
    
    def contar_interacoes_repetitivas(self, user_id) -> int:
        if not self.driver:
            return 0
        
        with self.driver.session() as session:
            result = session.run("""
                MATCH (u:User {id: $user_id})-[r:INTERAGE_COM]->(v:User)
                WITH v, count(r) as freq
                WHERE freq > 10
                RETURN count(v) as repetitivas
            """, user_id=user_id)
            
            record = result.single()
            return record["repetitivas"] if record else 0
    
    def contar_conexoes(self, user_id) -> int:
        if not self.driver:
            return 0
        
        with self.driver.session() as session:
            result = session.run("""
                MATCH (u:User {id: $user_id})-[:INTERAGE_COM]->()
                RETURN count(*) as total
            """, user_id=user_id)
            
            record = result.single()
            return record["total"] if record else 0
