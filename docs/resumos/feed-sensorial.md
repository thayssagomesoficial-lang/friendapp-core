# Resumo Técnico: Feed Sensorial

## Visão Geral

O Feed Sensorial do FriendApp não é uma timeline social tradicional. Ele é um **motor de ressonância**, projetado para organizar conteúdos com base em **compatibilidade energética** entre usuários e postagens, substituindo feeds cronológicos e de engajamento por sistema baseado em compatibilidade vibracional.

## Propósito Técnico

- **Escopo**: Substituir feed cronológico e de engajamento por sistema baseado em compatibilidade vibracional
- **Finalidade**: Conectar usuários a conteúdos que aumentam sua frequência energética
- **Diferencial**: Personalização em tempo real com IA, sem depender de popularidade ou curtidas

## Arquitetura do Sistema

### Componentes Principais

| Componente | Função Técnica |
|-----------|---------------|
| **Aurah Kosmos (IA)** | Analisa cada post e usuário, gerando vetores energéticos comparáveis |
| **Módulo de Vetorização** | Converte textos, imagens, áudios e vídeos em representações numéricas (`post_vector`) |
| **Ranking Multi-Stage** | Ordena postagens em três estágios: geração de candidatos, ranking leve e ranking pesado |
| **Firewall Vibracional** | Rotula posts por intensidade emocional (leve, intenso, colapso) e permite filtragem pelo usuário |
| **Sistema de Logs** | Registra frequência inicial, impacto e expansão vibracional de cada post |

### Definição Técnica

- Cada usuário possui um `user_vector` (perfil energético em tempo real)
- Cada postagem possui um `post_vector` (conteúdo transformado em vetor semântico + emocional)
- Feed é gerado comparando `user_vector` e `post_vector` com base em **similaridade de cossenos**
- Postagens filtradas por moderação, cacheadas por 3–5 minutos e exibidas em ordem de score de ressonância

## Fórmula Base do Score de Ressonância

```
Score(post, user) = 
  (0.4 * cosine_similarity(user_vector, post_vector)) +
  (0.3 * intenção_post) +
  (0.2 * impacto_coletivo) +
  (0.1 * freshness)
```

Onde:
- **cosine_similarity**: Mede compatibilidade entre usuário e conteúdo
- **intenção_post**: Peso extra para posts com tags positivas (curar, inspirar, alegrar)
- **impacto_coletivo**: Valor derivado de reações vibracionais do coletivo
- **freshness**: Tempo de vida da postagem (evita congelamento)

## Estrutura de Dados (posts)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| post_id | UUID | Identificador único |
| user_id | UUID | Autor |
| post_vector | Array[Float] | Vetor energético da postagem |
| intencao | String | Intenção declarada pelo usuário |
| score_ressonancia | Float | Valor calculado da fórmula |
| firewall_label | Enum | Leve, Intenso, Colapso |
| created_at | Timestamp | Data de criação |

## Vetorização de Conteúdo Multimodal

### Técnicas por Tipo de Conteúdo

| Tipo | Técnicas Utilizadas | Saída (post_vector) |
|------|-------------------|-------------------|
| **Texto** | NLP + embeddings semânticos (transformer encoder) | Vetor 512D |
| **Imagem** | CNN pré-treinada + análise de cor/expressão facial | Vetor 1024D |
| **Áudio** | FFT + espectrograma + embeddings de emoção sonora | Vetor 256D |
| **Vídeo** | Extração de frames + áudio + narrativa | Vetor 1536D (concatenação multimodal) |

### Pipeline de Vetorização

```python
function vetorizar_post(post):
    if post.tipo == "texto":
        vector = NLP_encoder(post.texto)
    elif post.tipo == "imagem":
        vector = CNN_extractor(post.imagem)
    elif post.tipo == "audio":
        vector = Audio_embedding(post.audio)
    elif post.tipo == "video":
        frame_vec = CNN_extractor(frames)
        audio_vec = Audio_embedding(audio)
        vector = concat(frame_vec, audio_vec)
    
    normalizado = normalize(vector)
    return normalizado
```

### Cálculo de Compatibilidade

```
Compatibilidade = cosine_similarity(user_vector, post_vector)
```

Valor entre -1 e 1:
- **1.0**: Máxima ressonância
- **0.0**: Neutro (sem relação)
- **-1.0**: Ressonância oposta (contraste energético)

## Ranking Multi-Stage

### Estrutura em 3 Estágios

| Estágio | Descrição Técnica | Tamanho Médio |
|---------|------------------|---------------|
| **Candidate Generation** | Seleção inicial de milhares de posts relevantes (conexões, região, afinidade básica) | ~5.000 posts |
| **Ranking Leve** | Algoritmo rápido ordena candidatos usando sinais simples (tempo, engajamento leve) | ~500 posts |
| **Ranking Pesado** | Aplicação do Score de Ressonância completo (cosine similarity + intenção + impacto) | ~50 posts |

### Pipeline de Geração de Feed

```python
function gerar_feed(usuario):
    candidatos = buscar_candidatos(usuario)              # Estágio 1
    candidatos_rankeados = ranking_leve(candidatos)      # Estágio 2
    feed_final = ranking_pesado(candidatos_rankeados)    # Estágio 3
    cache.store(usuario.id, feed_final, ttl=300s)
    return feed_final
```

### Ranking Leve (Sinais Simples)

| Sinal | Peso (%) | Observação |
|-------|----------|------------|
| Recência | 40% | Posts mais recentes |
| Afinidade (tags comuns) | 30% | Interesses compatíveis |
| Popularidade local | 20% | Visualizações e ressonância leve |
| Tipo de conteúdo | 10% | Preferências de mídia (texto/vídeo) |

### Ranking Pesado (Score Completo)

Usa a fórmula completa de Score de Ressonância definida anteriormente.

### Estratégia de Cache

- Cada feed personalizado salvo no **Redis Cache** por 3–5 minutos (TTL)
- Evita recomputar a cada abertura do app
- Atualizações em tempo real (ex: novo post de conexão próxima) disparam **invalidação seletiva**

## Firewall Vibracional Configurável

### Rotulagem Automática pela IA

| Rótulo | Critério Técnico | Exemplo de Conteúdo |
|--------|-----------------|-------------------|
| **Leve** | Frequência > 6.0 e intenção positiva | Reflexão motivacional |
| **Intenso** | Frequência 4.0–6.0 ou emoção forte | Desabafo emocional |
| **Colapso** | Frequência < 4.0 e negatividade persistente | Post de luto, raiva |

### Configuração pelo Usuário

| Configuração | Resultado no Feed |
|-------------|------------------|
| Mostrar tudo | Nenhum filtro, posts aparecem com rótulo simples |
| Esconder posts de colapso | Posts marcados como "colapso" não aparecem automaticamente |
| Aviso em conteúdos intensos | Overlay aplicado: "Conteúdo sensível. Toque para visualizar" |

### Exemplo de Content Warning

```json
{
  "post_id": "p123",
  "firewall_label": "colapso",
  "overlay": true,
  "mensagem": "Este post expressa uma dor profunda. Toque para visualizar."
}
```

UI no app: post fica borrado até o usuário tocar para desbloquear.

### Pseudocódigo — Aplicação de Firewall

```python
def aplicar_firewall(post, user_config):
    if post.firewall_label == "colapso" and not user_config["mostrar_colapso"]:
        return "ocultar"
    elif post.firewall_label == "intenso" and user_config["avisar_intenso"]:
        return "mostrar_overlay"
    else:
        return "mostrar_normal"
```

## Modos de Feed

### Tipos de Visualização

1. **Para Você** (curadoria IA)
   - Algoritmo completo de ressonância
   - Personalizado por vetor energético
   - Atualizado continuamente

2. **Conexões**
   - Posts apenas de conexões autênticas
   - Ordenado por ressonância + recência
   - Sem filtro algorítmico pesado

3. **Explorar**
   - Conteúdos fora da bolha
   - Exposição a perfis diferentes
   - Expande horizontes vibracionais

### "Por que estou vendo isso?"

Cada post tem explicação transparente:

```json
{
  "post_id": "p456",
  "reason": "Alta compatibilidade energética (87%)",
  "details": {
    "connection_type": "indireta",
    "shared_interests": ["arte", "meditação"],
    "vibrational_match": 0.87
  }
}
```

## Banco de Dados — Estrutura do Ranking

| Campo | Tipo | Descrição |
|-------|------|-----------|
| user_id | UUID | Usuário que recebe o feed |
| post_id | UUID | Post candidato |
| score_leve | Float | Score do ranking leve |
| score_final | Float | Score do ranking pesado |
| posicao_feed | Integer | Ordem final no feed |
| cache_expira_em | Timestamp | Data/hora de expiração do snapshot em cache |

### Exemplo de Log do Ranking

```json
{
  "user_id": "u123",
  "post_id": "p987",
  "score_leve": 0.62,
  "score_final": 0.87,
  "posicao_feed": 3,
  "cache_expira_em": "2025-09-08T18:05:00Z"
}
```

## Performance e Escalabilidade

### Otimizações

- **Candidate Generation**: Altamente paralelizável com consultas em bancos vetoriais (FAISS/Milvus)
- **Ranking Leve**: Roda em modelo simplificado (<10ms por consulta)
- **Ranking Pesado**: Só roda no top 500 candidatos, reduzindo custo em 90%
- **Cache**: Garante feed fluido mesmo em redes móveis

### Notas Técnicas

- Vetores recalculados em cada interação do usuário (mudança de aura/estado)
- Vetores armazenados em **FAISS** ou **Milvus** (banco vetorial) para consultas rápidas em escala
- Similaridade de cossenos é o cálculo principal, mas pode ser complementado por métricas como dot product ou distância euclidiana normalizada

## Integração com Ecossistema

O Feed Sensorial recebe dados de:
- **IA Aurah Kosmos**: Vetores de usuário atualizados
- **Sistema de Cadastro**: Perfil e intenção inicial
- **Teste de Personalidade**: Vetor energético base
- **Sistema de Conexões**: Rede de relacionamentos
- **Mapa de Frequência**: Contexto geográfico e vibracional

E alimenta:
- **Jogo da Transmutação**: Interações contam como ações
- **IA Aurah Kosmos**: Feedback de ressonância
- **Sistema de Conexões**: Descoberta de perfis compatíveis
- **Mapa de Frequência**: Atividade e engajamento

## Observabilidade

### Métricas
- Taxa de engajamento por tipo de post
- Distribuição de scores de ressonância
- Cache hit ratio
- Latência por estágio de ranking
- Taxa de uso do firewall vibracional
- Distribuição de modos de feed

### Logs
- Posts exibidos por usuário
- Interações (curtidas, comentários, compartilhamentos)
- Aplicações de firewall
- Invalidações de cache
- Mudanças de modo de feed

## Considerações de Implementação

- **Banco vetorial** (FAISS/Milvus) para similaridade de cossenos em escala
- **Redis cache** para feeds personalizados
- **PostgreSQL** para metadados e relacionamentos
- **Firestore** (opcional) para atualizações em tempo real
- **Kafka** para eventos assíncronos
- **Multi-stage ranking** para performance
- **NLP embeddings** pré-treinados para texto
- **CNNs** pré-treinadas para imagens
- **Análise de áudio** para conteúdo sonoro
- **Processamento de vídeo** multimodal
- **Firewall configurável** sem censura
- **Transparência algorítmica** ("Por que estou vendo isso?")
