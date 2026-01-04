import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/talent_model.dart';

class MSTService {
  static const String baseUrl = 'http://localhost:3010/api/mst';

  static Future<List<TalentModel>> getFeed({
    int limit = 20,
    int offset = 0,
    String? type,
    String? creatorId,
  }) async {
    final queryParams = {
      'limit': limit.toString(),
      'offset': offset.toString(),
      if (type != null) 'type': type,
      if (creatorId != null) 'creator_id': creatorId,
    };

    final uri = Uri.parse('$baseUrl/feed').replace(queryParameters: queryParams);
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final talents = data['talents'] as List;
      return talents.map((t) => TalentModel.fromJson(t)).toList();
    }
    throw Exception('Failed to load feed');
  }

  static Future<TalentModel> getTalent(String talentId) async {
    final response = await http.get(Uri.parse('$baseUrl/talents/$talentId'));

    if (response.statusCode == 200) {
      return TalentModel.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to load talent');
  }

  static Future<List<TalentModel>> getCreatorTalents(
    String creatorId, {
    int limit = 20,
    int offset = 0,
    String? status,
  }) async {
    final queryParams = {
      'limit': limit.toString(),
      'offset': offset.toString(),
      if (status != null) 'status': status,
    };

    final uri = Uri.parse('$baseUrl/creators/$creatorId/talents')
        .replace(queryParameters: queryParams);
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final talents = data['talents'] as List;
      return talents.map((t) => TalentModel.fromJson(t)).toList();
    }
    throw Exception('Failed to load creator talents');
  }

  static Future<CreatorInsights> getCreatorInsights(
    String creatorId,
    String authToken,
  ) async {
    final response = await http.get(
      Uri.parse('$baseUrl/creators/$creatorId/insights'),
      headers: {
        'x-user-id': creatorId,
        'Authorization': 'Bearer $authToken',
      },
    );

    if (response.statusCode == 200) {
      return CreatorInsights.fromJson(json.decode(response.body));
    }
    throw Exception('Failed to load creator insights');
  }

  static Future<void> registerEngagement(
    String talentId,
    String userId,
    String type, {
    String? waveType,
    double? secondsWatched,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/talents/$talentId/engagement'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'user_id': userId,
        'type': type,
        if (waveType != null) 'wave_type': waveType,
        if (secondsWatched != null) 'seconds_watched': secondsWatched,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to register engagement');
    }
  }

  static Future<Map<String, dynamic>> makeDonation(
    String talentId,
    String donorId,
    double amount, {
    String? message,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/talents/$talentId/donate'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'donor_id': donorId,
        'amount': amount,
        if (message != null) 'message': message,
      }),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    }
    throw Exception('Failed to make donation');
  }

  static Future<Map<String, dynamic>> createTalent({
    required String creatorId,
    required String title,
    required String type,
    String? description,
    String? intent,
    List<String>? mediaRefs,
    String? thumbnailUrl,
    double? durationSeconds,
    String? transcription,
    List<double>? featureVector,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/talents'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'creator_id': creatorId,
        'title': title,
        'type': type,
        if (description != null) 'description': description,
        if (intent != null) 'intent': intent,
        if (mediaRefs != null) 'media_refs': mediaRefs,
        if (thumbnailUrl != null) 'thumbnail_url': thumbnailUrl,
        if (durationSeconds != null) 'duration_seconds': durationSeconds,
        if (transcription != null) 'transcription': transcription,
        if (featureVector != null) 'feature_vector': featureVector,
      }),
    );

    if (response.statusCode == 201) {
      return json.decode(response.body);
    }
    throw Exception('Failed to create talent');
  }

  static Future<void> deleteTalent(String talentId, String userId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/talents/$talentId'),
      headers: {'x-user-id': userId},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete talent');
    }
  }
}
