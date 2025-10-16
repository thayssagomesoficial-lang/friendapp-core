import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/post_model.dart';

class FeedProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Post> _posts = [];
  bool _isLoading = false;
  bool _hasMore = true;
  String? _error;
  int _offset = 0;

  List<Post> get posts => _posts;
  bool get isLoading => _isLoading;
  bool get hasMore => _hasMore;
  String? get error => _error;

  Future<void> loadFeed({bool refresh = false}) async {
    if (_isLoading) return;

    if (refresh) {
      _offset = 0;
      _posts = [];
      _hasMore = true;
    }

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final newPosts = await _apiService.getFeed(limit: 20, offset: _offset);
      
      if (newPosts.isEmpty) {
        _hasMore = false;
      } else {
        _posts.addAll(newPosts);
        _offset += newPosts.length;
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> createPost({
    required String content,
    List<String>? sensorialTags,
    String? emotionTone,
  }) async {
    try {
      final post = await _apiService.createPost(
        content: content,
        sensorialTags: sensorialTags,
        emotionTone: emotionTone,
      );
      
      _posts.insert(0, post);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> likePost(String postId) async {
    try {
      await _apiService.interactWithPost(
        postId: postId,
        interactionType: 'like',
      );
      
      final index = _posts.indexWhere((p) => p.id == postId);
      if (index != -1) {
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
}
