import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PainelConfiancaScreen extends StatefulWidget {
  final String userId;

  const PainelConfiancaScreen({Key? key, required this.userId}) : super(key: key);

  @override
  State<PainelConfiancaScreen> createState() => _PainelConfiancaScreenState();
}

class _PainelConfiancaScreenState extends State<PainelConfiancaScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _dadosConfianca;
  Map<String, dynamic>? _dadosReputacao;
  List<dynamic>? _selos;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  Future<void> _carregarDados() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final reputacaoResponse = await http.get(
        Uri.parse('http://localhost:3006/api/reputacao/usuario/${widget.userId}'),
      );

      final selosResponse = await http.get(
        Uri.parse('http://localhost:3004/api/selos/usuario/${widget.userId}'),
      );

      final verificacaoResponse = await http.get(
        Uri.parse('http://localhost:3005/api/verificacao/status/${widget.userId}'),
      );

      if (reputacaoResponse.statusCode == 200) {
        _dadosReputacao = json.decode(reputacaoResponse.body);
      }

      if (selosResponse.statusCode == 200) {
        final selosData = json.decode(selosResponse.body);
        _selos = selosData['seals'];
      }

      if (verificacaoResponse.statusCode == 200) {
        _dadosConfianca = json.decode(verificacaoResponse.body);
      }

      setState(() {
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      print('Erro ao carregar dados: $e');
    }
  }

  Color _getCorPorEstado(String estado) {
    switch (estado) {
      case 'fluxo_em_construcao':
        return Colors.green.shade200;
      case 'energia_estavel':
        return Colors.green.shade400;
      case 'coerencia_elevada':
        return Colors.purple.shade300;
      case 'guardiao_vibracao':
        return Colors.amber.shade400;
      default:
        return Colors.grey.shade300;
    }
  }

  String _getEmojiPorEstado(String estado) {
    switch (estado) {
      case 'fluxo_em_construcao':
        return '🌱';
      case 'energia_estavel':
        return '🌿';
      case 'coerencia_elevada':
        return '✨';
      case 'guardiao_vibracao':
        return '🌟';
      default:
        return '🔮';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Painel de Confiança Vibracional'),
        backgroundColor: Colors.deepPurple,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _carregarDados,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildScoreCard(),
                    const SizedBox(height: 20),
                    _buildVerificacaoCard(),
                    const SizedBox(height: 20),
                    _buildSelosCard(),
                    const SizedBox(height: 20),
                    _buildInsightsCard(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildScoreCard() {
    final score = _dadosReputacao?['score'] ?? 0;
    final estado = _dadosReputacao?['estado'] ?? {};
    final estadoNome = estado['nome'] ?? 'Desconhecido';
    final cor = _getCorPorEstado(estadoNome.toLowerCase().replaceAll(' ', '_'));
    final emoji = _getEmojiPorEstado(estadoNome.toLowerCase().replaceAll(' ', '_'));

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [cor.withOpacity(0.3), cor.withOpacity(0.1)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            Text(
              emoji,
              style: const TextStyle(fontSize: 48),
            ),
            const SizedBox(height: 10),
            Text(
              estadoNome,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 120,
                  height: 120,
                  child: CircularProgressIndicator(
                    value: score / 100,
                    strokeWidth: 12,
                    backgroundColor: Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(cor),
                  ),
                ),
                Text(
                  '$score',
                  style: const TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Text(
              estado['descricao'] ?? '',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade700,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVerificacaoCard() {
    final verificado = _dadosConfianca?['verified'] ?? false;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  verificado ? Icons.verified : Icons.warning,
                  color: verificado ? Colors.green : Colors.orange,
                  size: 32,
                ),
                const SizedBox(width: 10),
                const Text(
                  'Verificação de Identidade',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  verificado ? 'Identidade Verificada ✅' : 'Não Verificado',
                  style: TextStyle(
                    fontSize: 16,
                    color: verificado ? Colors.green : Colors.orange,
                  ),
                ),
                if (!verificado)
                  ElevatedButton(
                    onPressed: () {},
                    child: const Text('Verificar'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelosCard() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Selos Conquistados',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 15),
            _selos == null || _selos!.isEmpty
                ? const Text('Nenhum selo conquistado ainda')
                : Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: _selos!.map((selo) {
                      return Chip(
                        label: Text(selo['seal_type'] ?? ''),
                        avatar: const CircleAvatar(
                          child: Icon(Icons.star, size: 16),
                        ),
                      );
                    }).toList(),
                  ),
          ],
        ),
      ),
    );
  }

  Widget _buildInsightsCard() {
    final coerencia = _dadosReputacao?['coherence'] ?? 0.0;
    final reciprocidade = _dadosReputacao?['reciprocity'] ?? 0.0;
    final feedbacks = _dadosReputacao?['feedbacks_positive'] ?? 0;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.lightbulb, color: Colors.amber),
                SizedBox(width: 10),
                Text(
                  'Insights da Aurah Kosmos',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
            _buildInsightItem('Coerência', coerencia, Colors.purple),
            const SizedBox(height: 10),
            _buildInsightItem('Reciprocidade', reciprocidade, Colors.blue),
            const SizedBox(height: 10),
            ListTile(
              leading: const Icon(Icons.thumb_up, color: Colors.green),
              title: const Text('Feedbacks Positivos'),
              trailing: Text(
                '$feedbacks',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInsightItem(String label, double value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        const SizedBox(height: 5),
        LinearProgressIndicator(
          value: value,
          backgroundColor: Colors.grey.shade200,
          valueColor: AlwaysStoppedAnimation<Color>(color),
        ),
        const SizedBox(height: 5),
        Text(
          '${(value * 100).toStringAsFixed(0)}%',
          style: const TextStyle(fontSize: 12),
        ),
      ],
    );
  }
}
