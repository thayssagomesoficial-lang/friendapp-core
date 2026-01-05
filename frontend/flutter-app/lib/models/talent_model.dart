class TalentModel {
  final String id;
  final String creatorId;
  final String title;
  final String? description;
  final String type;
  final String? thumbnailUrl;
  final double? durationSeconds;
  final double impactScore;
  final double riskScore;
  final Map<String, double> archetypeScores;
  final String status;
  final String visibility;
  final int totalViews;
  final int totalWaves;
  final double totalDonations;
  final DateTime? publishedAt;
  final DateTime createdAt;

  TalentModel({
    required this.id,
    required this.creatorId,
    required this.title,
    this.description,
    required this.type,
    this.thumbnailUrl,
    this.durationSeconds,
    required this.impactScore,
    required this.riskScore,
    required this.archetypeScores,
    required this.status,
    required this.visibility,
    required this.totalViews,
    required this.totalWaves,
    required this.totalDonations,
    this.publishedAt,
    required this.createdAt,
  });

  factory TalentModel.fromJson(Map<String, dynamic> json) {
    Map<String, double> archetypes = {};
    if (json['archetype_scores'] != null) {
      final scores = json['archetype_scores'] is String
          ? {}
          : json['archetype_scores'] as Map<String, dynamic>;
      scores.forEach((key, value) {
        archetypes[key] = (value as num).toDouble();
      });
    }

    return TalentModel(
      id: json['id'] ?? '',
      creatorId: json['creator_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      type: json['type'] ?? 'video',
      thumbnailUrl: json['thumbnail_url'],
      durationSeconds: json['duration_seconds']?.toDouble(),
      impactScore: (json['impact_score'] ?? 0).toDouble(),
      riskScore: (json['risk_score'] ?? 0).toDouble(),
      archetypeScores: archetypes,
      status: json['status'] ?? 'pending',
      visibility: json['visibility'] ?? 'public',
      totalViews: json['total_views'] ?? 0,
      totalWaves: json['total_waves'] ?? 0,
      totalDonations: (json['total_donations'] ?? 0).toDouble(),
      publishedAt: json['published_at'] != null
          ? DateTime.parse(json['published_at'])
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }

  String get typeEmoji {
    switch (type) {
      case 'video':
        return '🎬';
      case 'audio':
        return '🎵';
      case 'text':
        return '📝';
      case 'mixed':
        return '🎨';
      default:
        return '✨';
    }
  }

  String get formattedDuration {
    if (durationSeconds == null) return '';
    final minutes = (durationSeconds! / 60).floor();
    final seconds = (durationSeconds! % 60).floor();
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}

class CreatorInsights {
  final String creatorId;
  final int totalTalents;
  final int approvedTalents;
  final int pendingReview;
  final double avgImpactScore;
  final int totalViews;
  final int totalWaves;
  final double totalDonations;
  final int uniqueViewers;
  final Map<String, double> archetypeProfile;

  CreatorInsights({
    required this.creatorId,
    required this.totalTalents,
    required this.approvedTalents,
    required this.pendingReview,
    required this.avgImpactScore,
    required this.totalViews,
    required this.totalWaves,
    required this.totalDonations,
    required this.uniqueViewers,
    required this.archetypeProfile,
  });

  factory CreatorInsights.fromJson(Map<String, dynamic> json) {
    Map<String, double> archetypes = {};
    if (json['archetype_profile'] != null) {
      final profile = json['archetype_profile'] as Map<String, dynamic>;
      profile.forEach((key, value) {
        archetypes[key] = (value as num).toDouble();
      });
    }

    final overview = json['overview'] ?? {};
    final engagement = json['engagement'] ?? {};

    return CreatorInsights(
      creatorId: json['creator_id'] ?? '',
      totalTalents: overview['total_talents'] ?? 0,
      approvedTalents: overview['approved_talents'] ?? 0,
      pendingReview: overview['pending_review'] ?? 0,
      avgImpactScore: (overview['avg_impact_score'] ?? 0).toDouble(),
      totalViews: engagement['total_views'] ?? 0,
      totalWaves: engagement['total_waves'] ?? 0,
      totalDonations: (engagement['total_donations'] ?? 0).toDouble(),
      uniqueViewers: engagement['unique_viewers'] ?? 0,
      archetypeProfile: archetypes,
    );
  }
}
