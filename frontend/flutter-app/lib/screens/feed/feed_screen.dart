import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/feed_provider.dart';
import '../../models/post_model.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<FeedProvider>(context, listen: false).loadFeed(refresh: true);
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent * 0.9) {
      final feedProvider = Provider.of<FeedProvider>(context, listen: false);
      if (!feedProvider.isLoading && feedProvider.hasMore) {
        feedProvider.loadFeed();
      }
    }
  }

  Future<void> _showCreatePostDialog() async {
    final contentController = TextEditingController();
    String? selectedEmotion;

    final emotions = {
      'amor': '💜 Amor',
      'gratidao': '🙏 Gratidão',
      'alegria': '😊 Alegria',
      'paz': '☮️ Paz',
      'inspiracao': '✨ Inspiração',
      'reflexao': '🤔 Reflexão',
      'curiosidade': '🔍 Curiosidade',
      'transformacao': '🦋 Transformação',
    };

    await showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Criar Post'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextField(
                  controller: contentController,
                  maxLines: 5,
                  decoration: const InputDecoration(
                    hintText: 'Compartilhe sua vibração...',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                const Text('Tom Emocional:'),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: emotions.entries.map((entry) {
                    return FilterChip(
                      label: Text(entry.value),
                      selected: selectedEmotion == entry.key,
                      onSelected: (selected) {
                        setState(() {
                          selectedEmotion = selected ? entry.key : null;
                        });
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancelar'),
            ),
            FilledButton(
              onPressed: () async {
                if (contentController.text.trim().isNotEmpty) {
                  final feedProvider = Provider.of<FeedProvider>(context, listen: false);
                  await feedProvider.createPost(
                    content: contentController.text.trim(),
                    emotionTone: selectedEmotion,
                  );
                  Navigator.of(context).pop();
                }
              },
              child: const Text('Publicar'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Feed Sensorial'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: _showCreatePostDialog,
          ),
        ],
      ),
      body: Consumer<FeedProvider>(
        builder: (context, feedProvider, _) {
          if (feedProvider.isLoading && feedProvider.posts.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (feedProvider.posts.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.auto_awesome_outlined,
                    size: 64,
                    color: Colors.grey,
                  ),
                  const SizedBox(height: 16),
                  const Text('Nenhum post ainda'),
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: _showCreatePostDialog,
                    child: const Text('Criar primeiro post'),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => feedProvider.loadFeed(refresh: true),
            child: ListView.separated(
              controller: _scrollController,
              itemCount: feedProvider.posts.length + (feedProvider.hasMore ? 1 : 0),
              separatorBuilder: (context, index) => const Divider(height: 1),
              itemBuilder: (context, index) {
                if (index >= feedProvider.posts.length) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: CircularProgressIndicator(),
                    ),
                  );
                }

                final post = feedProvider.posts[index];
                return _PostCard(post: post);
              },
            ),
          );
        },
      ),
    );
  }
}

class _PostCard extends StatelessWidget {
  final Post post;

  const _PostCard({required this.post});

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays}d atrás';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h atrás';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}min atrás';
    } else {
      return 'agora';
    }
  }

  Color _getEmotionColor(String? emotion) {
    switch (emotion) {
      case 'amor':
        return Colors.purple;
      case 'gratidao':
        return Colors.orange;
      case 'alegria':
        return Colors.yellow.shade700;
      case 'paz':
        return Colors.blue;
      case 'inspiracao':
        return Colors.pink;
      case 'reflexao':
        return Colors.indigo;
      case 'curiosidade':
        return Colors.teal;
      case 'transformacao':
        return Colors.deepPurple;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage: post.userProfilePicture != null
                      ? NetworkImage(post.userProfilePicture!)
                      : null,
                  child: post.userProfilePicture == null
                      ? Text(post.userName[0].toUpperCase())
                      : null,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post.userName,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _formatDate(post.createdAt),
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                if (post.emotionTone != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getEmotionColor(post.emotionTone).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      post.emotionTone!,
                      style: TextStyle(
                        fontSize: 12,
                        color: _getEmotionColor(post.emotionTone),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Text(post.content),
            if (post.reasonShown != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.auto_awesome,
                      size: 16,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      post.reasonShown!,
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 12),
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.favorite_border),
                  onPressed: () {
                    Provider.of<FeedProvider>(context, listen: false).likePost(post.id);
                  },
                ),
                Text('${post.likesCount}'),
                const SizedBox(width: 16),
                const Icon(Icons.comment_outlined, size: 20),
                const SizedBox(width: 4),
                Text('${post.commentsCount}'),
                const SizedBox(width: 16),
                const Icon(Icons.share_outlined, size: 20),
                const SizedBox(width: 4),
                Text('${post.sharesCount}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
