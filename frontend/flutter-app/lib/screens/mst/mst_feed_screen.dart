import 'package:flutter/material.dart';
import '../../models/talent_model.dart';
import '../../services/mst_service.dart';
import 'talent_detail_screen.dart';

class MSTFeedScreen extends StatefulWidget {
  final String userId;

  const MSTFeedScreen({Key? key, required this.userId}) : super(key: key);

  @override
  State<MSTFeedScreen> createState() => _MSTFeedScreenState();
}

class _MSTFeedScreenState extends State<MSTFeedScreen> {
  List<TalentModel> _talents = [];
  bool _isLoading = true;
  String? _selectedType;
  final ScrollController _scrollController = ScrollController();
  int _offset = 0;
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _loadFeed();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      if (!_isLoading && _hasMore) {
        _loadMore();
      }
    }
  }

  Future<void> _loadFeed() async {
    setState(() {
      _isLoading = true;
      _offset = 0;
    });

    try {
      final talents = await MSTService.getFeed(
        limit: 20,
        offset: 0,
        type: _selectedType,
      );
      setState(() {
        _talents = talents;
        _isLoading = false;
        _hasMore = talents.length >= 20;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      _showError('Erro ao carregar feed: $e');
    }
  }

  Future<void> _loadMore() async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final newTalents = await MSTService.getFeed(
        limit: 20,
        offset: _offset + 20,
        type: _selectedType,
      );
      setState(() {
        _talents.addAll(newTalents);
        _offset += 20;
        _isLoading = false;
        _hasMore = newTalents.length >= 20;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: Colors.red),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mostre Seu Talento'),
        backgroundColor: Colors.deepPurple,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => CreatorDashboardScreen(
                    creatorId: widget.userId,
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterChips(),
          Expanded(
            child: _isLoading && _talents.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadFeed,
                    child: _talents.isEmpty
                        ? _buildEmptyState()
                        : _buildTalentGrid(),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => CreateTalentScreen(creatorId: widget.userId),
            ),
          ).then((_) => _loadFeed());
        },
        backgroundColor: Colors.deepPurple,
        icon: const Icon(Icons.add),
        label: const Text('Criar'),
      ),
    );
  }

  Widget _buildFilterChips() {
    final types = [
      {'value': null, 'label': 'Todos', 'emoji': '✨'},
      {'value': 'video', 'label': 'Video', 'emoji': '🎬'},
      {'value': 'audio', 'label': 'Audio', 'emoji': '🎵'},
      {'value': 'text', 'label': 'Texto', 'emoji': '📝'},
    ];

    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: types.length,
        itemBuilder: (context, index) {
          final type = types[index];
          final isSelected = _selectedType == type['value'];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
            child: FilterChip(
              label: Text('${type['emoji']} ${type['label']}'),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  _selectedType = selected ? type['value'] as String? : null;
                });
                _loadFeed();
              },
              selectedColor: Colors.deepPurple.shade100,
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.music_note, size: 80, color: Colors.grey),
          const SizedBox(height: 16),
          const Text(
            'Nenhum talento encontrado',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: _loadFeed,
            child: const Text('Recarregar'),
          ),
        ],
      ),
    );
  }

  Widget _buildTalentGrid() {
    return GridView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(8),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.75,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: _talents.length + (_hasMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index >= _talents.length) {
          return const Center(child: CircularProgressIndicator());
        }
        return _buildTalentCard(_talents[index]);
      },
    );
  }

  Widget _buildTalentCard(TalentModel talent) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => TalentDetailScreen(
              talentId: talent.id,
              userId: widget.userId,
            ),
          ),
        ).then((_) => _loadFeed());
      },
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 3,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                  gradient: LinearGradient(
                    colors: [
                      Colors.deepPurple.shade300,
                      Colors.deepPurple.shade700,
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Stack(
                  children: [
                    Center(
                      child: Text(
                        talent.typeEmoji,
                        style: const TextStyle(fontSize: 48),
                      ),
                    ),
                    if (talent.durationSeconds != null)
                      Positioned(
                        bottom: 8,
                        right: 8,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.black54,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            talent.formattedDuration,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.amber,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '${talent.impactScore.toInt()}',
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      talent.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        const Icon(Icons.visibility, size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          '${talent.totalViews}',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        const SizedBox(width: 12),
                        const Icon(Icons.favorite, size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          '${talent.totalWaves}',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CreatorDashboardScreen extends StatefulWidget {
  final String creatorId;

  const CreatorDashboardScreen({Key? key, required this.creatorId}) : super(key: key);

  @override
  State<CreatorDashboardScreen> createState() => _CreatorDashboardScreenState();
}

class _CreatorDashboardScreenState extends State<CreatorDashboardScreen> {
  CreatorInsights? _insights;
  List<TalentModel> _talents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final talents = await MSTService.getCreatorTalents(widget.creatorId);
      setState(() {
        _talents = talents;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Meu Dashboard'),
        backgroundColor: Colors.deepPurple,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildStatsCard(),
                    const SizedBox(height: 20),
                    _buildTalentsSection(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildStatsCard() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [
              Colors.deepPurple.shade300,
              Colors.deepPurple.shade700,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            const Text(
              '🎤 Seus Talentos',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatItem('Talentos', '${_talents.length}', Icons.music_note),
                _buildStatItem(
                  'Views',
                  '${_talents.fold(0, (sum, t) => sum + t.totalViews)}',
                  Icons.visibility,
                ),
                _buildStatItem(
                  'Waves',
                  '${_talents.fold(0, (sum, t) => sum + t.totalWaves)}',
                  Icons.favorite,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 28),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }

  Widget _buildTalentsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Meus Talentos',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        if (_talents.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(32),
              child: Text(
                'Voce ainda nao criou nenhum talento.\nComece agora!',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
            ),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _talents.length,
            itemBuilder: (context, index) {
              final talent = _talents[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.deepPurple.shade100,
                    child: Text(talent.typeEmoji),
                  ),
                  title: Text(talent.title),
                  subtitle: Text(
                    'Impact: ${talent.impactScore.toInt()} | ${talent.totalViews} views',
                  ),
                  trailing: _buildStatusChip(talent.status),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => TalentDetailScreen(
                          talentId: talent.id,
                          userId: widget.creatorId,
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          ),
      ],
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    String label;
    switch (status) {
      case 'approved':
        color = Colors.green;
        label = 'Aprovado';
        break;
      case 'review':
        color = Colors.orange;
        label = 'Em Revisao';
        break;
      case 'rejected':
        color = Colors.red;
        label = 'Rejeitado';
        break;
      default:
        color = Colors.grey;
        label = 'Pendente';
    }
    return Chip(
      label: Text(label, style: const TextStyle(fontSize: 10)),
      backgroundColor: color.withOpacity(0.2),
      labelStyle: TextStyle(color: color),
    );
  }
}

class CreateTalentScreen extends StatefulWidget {
  final String creatorId;

  const CreateTalentScreen({Key? key, required this.creatorId}) : super(key: key);

  @override
  State<CreateTalentScreen> createState() => _CreateTalentScreenState();
}

class _CreateTalentScreenState extends State<CreateTalentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _selectedType = 'video';
  bool _isSubmitting = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitTalent() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
    });

    try {
      final result = await MSTService.createTalent(
        creatorId: widget.creatorId,
        title: _titleController.text,
        type: _selectedType,
        description: _descriptionController.text.isNotEmpty
            ? _descriptionController.text
            : null,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Talento criado! Status: ${result['status']}'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao criar talento: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Criar Talento'),
        backgroundColor: Colors.deepPurple,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Compartilhe seu talento com o mundo!',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Titulo',
                  hintText: 'De um titulo ao seu talento',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor, insira um titulo';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Descricao (opcional)',
                  hintText: 'Descreva seu talento',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              const Text(
                'Tipo de conteudo',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [
                  _buildTypeChip('video', '🎬 Video'),
                  _buildTypeChip('audio', '🎵 Audio'),
                  _buildTypeChip('text', '📝 Texto'),
                  _buildTypeChip('mixed', '🎨 Misto'),
                ],
              ),
              const SizedBox(height: 24),
              Container(
                width: double.infinity,
                height: 150,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.cloud_upload,
                      size: 48,
                      color: Colors.grey.shade400,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Upload de midia (em breve)',
                      style: TextStyle(color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _submitTalent,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepPurple,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isSubmitting
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'Publicar Talento',
                          style: TextStyle(fontSize: 16),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTypeChip(String value, String label) {
    final isSelected = _selectedType == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _selectedType = value;
          });
        }
      },
      selectedColor: Colors.deepPurple.shade100,
    );
  }
}
