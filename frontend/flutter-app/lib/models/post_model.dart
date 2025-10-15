class Post {
  final String id;
  final String userId;
  final String userName;
  final String? userProfilePicture;
  final String content;
  final List<String>? mediaUrls;
  final List<String>? sensorialTags;
  final String? emotionTone;
  final double frequencyLevel;
  final String visibility;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;
  final DateTime createdAt;
  final double? relevanceScore;
  final String? reasonShown;

  Post({
    required this.id,
    required this.userId,
    required this.userName,
    this.userProfilePicture,
    required this.content,
    this.mediaUrls,
    this.sensorialTags,
    this.emotionTone,
    required this.frequencyLevel,
    required this.visibility,
    required this.likesCount,
    required this.commentsCount,
    required this.sharesCount,
    required this.createdAt,
    this.relevanceScore,
    this.reasonShown,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      userId: json['userId'],
      userName: json['userName'],
      userProfilePicture: json['userProfilePicture'],
      content: json['content'],
      mediaUrls: json['mediaUrls'] != null 
          ? List<String>.from(json['mediaUrls']) 
          : null,
      sensorialTags: json['sensorialTags'] != null
          ? List<String>.from(json['sensorialTags'])
          : null,
      emotionTone: json['emotionTone'],
      frequencyLevel: json['frequencyLevel'].toDouble(),
      visibility: json['visibility'],
      likesCount: json['likesCount'],
      commentsCount: json['commentsCount'],
      sharesCount: json['sharesCount'],
      createdAt: DateTime.parse(json['createdAt']),
      relevanceScore: json['relevanceScore']?.toDouble(),
      reasonShown: json['reasonShown'],
    );
  }
}
