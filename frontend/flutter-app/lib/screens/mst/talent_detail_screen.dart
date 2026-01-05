import 'package:flutter/material.dart';
import '../../models/talent_model.dart';
import '../../services/mst_service.dart';

class TalentDetailScreen extends StatefulWidget {
  final String talentId;
  final String userId;

  const TalentDetailScreen({
    Key? key,
    required this.talentId,
    required this.userId,
  }) : super(key: key);

  @override
  State<TalentDetailScreen> createState() => _TalentDetailScreenState();
}

class _TalentDetailScreenState extends State<TalentDetailScreen> {
  TalentModel? _talent;
  bool _isLoading = true;
  bool _hasWaved = false;

  @override
  void initState() {
    super.initState();
    _loadTalent();
    _registerView();
  }

  Future<void> _loadTalent() async {
    try {
      final talent = await MSTService.getTalent(widget.talentId);
      setState(() {
        _talent = talent;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showError('Erro ao carregar talento: $e');
    }
  }

  Future<void> _registerView() async {
    try {
      await MSTService.registerEngagement(
        widget.talentId,
        widget.userId,
        'view',
      );
    } catch (e) {
      print('Error registering view: $e');
    }
  }

  Future<void> _sendWave(String waveType) async {
    if (_hasWaved) return;

    try {
      await MSTService.registerEngagement(
        widget.talentId,
        widget.userId,
        'wave',
        waveType: waveType,
      );
      setState(() {
        _hasWaved = true;
      });
      _showSuccess('Wave enviado! $waveType');
    } catch (e) {
      _showError('Erro ao enviar wave: $e');
    }
  }

  Future<void> _showDonationDialog() async {
    final amountController = TextEditingController();
    final messageController = TextEditingController();

    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Enviar Doacao'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: amountController,
              decoration: const InputDecoration(
                labelText: 'Valor (FriendCoins)',
                prefixIcon: Icon(Icons.monetization_on),
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: messageController,
              decoration: const InputDecoration(
                labelText: 'Mensagem (opcional)',
                prefixIcon: Icon(Icons.message),
              ),
              maxLines: 2,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.deepPurple),
            child: const Text('Doar'),
          ),
        ],
      ),
    );

    if (result == true && amountController.text.isNotEmpty) {
      try {
        final amount = double.parse(amountController.text);
        await MSTService.makeDonation(
          widget.talentId,
          widget.userId,
          amount,
          message: messageController.text.isNotEmpty
              ? messageController.text
              : null,
        );
        _showSuccess('Doacao enviada com sucesso!');
        _loadTalent();
      } catch (e) {
        _showError('Erro ao enviar doacao: $e');
      }
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.green),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _talent == null
              ? const Center(child: Text('Talento nao encontrado'))
              : CustomScrollView(
                  slivers: [
                    _buildAppBar(),
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _buildTitleSection(),
                            const SizedBox(height: 20),
                            _buildStatsSection(),
                            const SizedBox(height: 20),
                            _buildArchetypeSection(),
                            const SizedBox(height: 20),
                            _buildDescriptionSection(),
                            const SizedBox(height: 100),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
      bottomSheet: _talent != null ? _buildBottomActions() : null,
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      backgroundColor: Colors.deepPurple,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Colors.deepPurple.shade300,
                Colors.deepPurple.shade900,
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _talent!.typeEmoji,
                  style: const TextStyle(fontSize: 80),
                ),
                if (_talent!.durationSeconds != null)
                  Container(
                    margin: const EdgeInsets.only(top: 16),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black38,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _talent!.formattedDuration,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        if (_talent!.creatorId == widget.userId)
          PopupMenuButton<String>(
            onSelected: (value) async {
              if (value == 'delete') {
                final confirm = await showDialog<bool>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('Excluir Talento'),
                    content: const Text(
                      'Tem certeza que deseja excluir este talento?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context, false),
                        child: const Text('Cancelar'),
                      ),
                      ElevatedButton(
                        onPressed: () => Navigator.pop(context, true),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                        ),
                        child: const Text('Excluir'),
                      ),
                    ],
                  ),
                );
                if (confirm == true) {
                  try {
                    await MSTService.deleteTalent(
                      widget.talentId,
                      widget.userId,
                    );
                    if (mounted) {
                      Navigator.pop(context);
                      _showSuccess('Talento excluido');
                    }
                  } catch (e) {
                    _showError('Erro ao excluir: $e');
                  }
                }
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    Icon(Icons.delete, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Excluir'),
                  ],
                ),
              ),
            ],
          ),
      ],
    );
  }

  Widget _buildTitleSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _talent!.title,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.amber,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.star, size: 16, color: Colors.black),
                  const SizedBox(width: 4),
                  Text(
                    'Impact ${_talent!.impactScore.toInt()}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.deepPurple.shade100,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                _talent!.type.toUpperCase(),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.deepPurple.shade700,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatsSection() {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildStatItem(
              Icons.visibility,
              '${_talent!.totalViews}',
              'Views',
            ),
            _buildStatItem(
              Icons.favorite,
              '${_talent!.totalWaves}',
              'Waves',
            ),
            _buildStatItem(
              Icons.monetization_on,
              '${_talent!.totalDonations.toInt()}',
              'FC',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: Colors.deepPurple, size: 28),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildArchetypeSection() {
    if (_talent!.archetypeScores.isEmpty) return const SizedBox.shrink();

    final archetypeEmojis = {
      'expressivo': '🎭',
      'tecnico': '⚙️',
      'emocional': '💖',
      'energetico': '⚡',
      'narrativo': '📖',
      'visual': '👁️',
      'sonoro': '🔊',
    };

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Perfil do Talento',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            ..._talent!.archetypeScores.entries.map((entry) {
              final emoji = archetypeEmojis[entry.key] ?? '✨';
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    Text(emoji, style: const TextStyle(fontSize: 20)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            entry.key.substring(0, 1).toUpperCase() +
                                entry.key.substring(1),
                            style: const TextStyle(fontSize: 12),
                          ),
                          LinearProgressIndicator(
                            value: entry.value,
                            backgroundColor: Colors.grey.shade200,
                            valueColor: const AlwaysStoppedAnimation<Color>(
                              Colors.deepPurple,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${(entry.value * 100).toInt()}%',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildDescriptionSection() {
    if (_talent!.description == null || _talent!.description!.isEmpty) {
      return const SizedBox.shrink();
    }

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Descricao',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _talent!.description!,
              style: const TextStyle(fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomActions() {
    final isOwnTalent = _talent!.creatorId == widget.userId;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          if (!isOwnTalent) ...[
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _hasWaved ? null : () => _sendWave('aplausos'),
                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      _hasWaved ? Colors.grey : Colors.deepPurple,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                icon: Icon(_hasWaved ? Icons.check : Icons.favorite),
                label: Text(_hasWaved ? 'Enviado!' : 'Wave 👏'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _showDonationDialog,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.amber,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                icon: const Icon(Icons.monetization_on, color: Colors.black),
                label: const Text(
                  'Doar',
                  style: TextStyle(color: Colors.black),
                ),
              ),
            ),
          ] else
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                icon: const Icon(Icons.share),
                label: const Text('Compartilhar'),
              ),
            ),
        ],
      ),
    );
  }
}
