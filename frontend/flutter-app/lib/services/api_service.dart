import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';
import '../models/post_model.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api/v1';
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: 'auth_token');
  }

  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String birthDate,
    required String consciousIntention,
    required List<String> seekingConnections,
    String? gender,
    String? locationCity,
    String? locationState,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/cadastro/register'),
      headers: await _getHeaders(includeAuth: false),
      body: jsonEncode({
        'email': email,
        'password': password,
        'name': name,
        'birthDate': birthDate,
        'consciousIntention': consciousIntention,
        'seekingConnections': seekingConnections,
        'gender': gender,
        'locationCity': locationCity,
        'locationState': locationState,
        'locationCountry': 'Brasil',
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body)['data'];
      await saveToken(data['token']);
      return data;
    } else {
      throw Exception('Falha ao registrar: ${response.body}');
    }
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/cadastro/login'),
      headers: await _getHeaders(includeAuth: false),
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body)['data'];
      await saveToken(data['token']);
      return data;
    } else {
      throw Exception('Falha ao fazer login: ${response.body}');
    }
  }

  Future<User> getProfile() async {
    final response = await http.get(
      Uri.parse('$baseUrl/cadastro/profile'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body)['data']['user'];
      return User.fromJson(data);
    } else {
      throw Exception('Falha ao obter perfil: ${response.body}');
    }
  }

  Future<List<Map<String, dynamic>>> getPersonalityQuestions() async {
    final response = await http.get(
      Uri.parse('$baseUrl/personalidade/questions'),
      headers: await _getHeaders(includeAuth: false),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body)['data']['questions'];
      return List<Map<String, dynamic>>.from(data);
    } else {
      throw Exception('Falha ao obter perguntas: ${response.body}');
    }
  }

  Future<PersonalityTestResult> submitPersonalityTest({
    required List<Map<String, dynamic>> answers,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/personalidade/submit'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'testVersion': 'v1.0',
        'answers': answers,
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body)['data']['result'];
      return PersonalityTestResult.fromJson(data);
    } else {
      throw Exception('Falha ao submeter teste: ${response.body}');
    }
  }

  Future<List<Post>> getFeed({int limit = 20, int offset = 0}) async {
    final response = await http.get(
      Uri.parse('$baseUrl/feed/posts?limit=$limit&offset=$offset'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body)['data']['feed'];
      return List<Post>.from(data.map((post) => Post.fromJson(post)));
    } else {
      throw Exception('Falha ao obter feed: ${response.body}');
    }
  }

  Future<Post> createPost({
    required String content,
    List<String>? sensorialTags,
    String? emotionTone,
    String visibility = 'public',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/feed/posts'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'content': content,
        'sensorialTags': sensorialTags,
        'emotionTone': emotionTone,
        'visibility': visibility,
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body)['data']['post'];
      return Post.fromJson(data);
    } else {
      throw Exception('Falha ao criar post: ${response.body}');
    }
  }

  Future<void> interactWithPost({
    required String postId,
    required String interactionType,
    int? durationSeconds,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/feed/posts/$postId/interact'),
      headers: await _getHeaders(),
      body: jsonEncode({
        'interactionType': interactionType,
        'durationSeconds': durationSeconds,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Falha ao interagir com post: ${response.body}');
    }
  }
}
