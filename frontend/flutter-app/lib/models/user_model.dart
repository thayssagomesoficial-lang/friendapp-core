class User {
  final String id;
  final String email;
  final String name;
  final String? birthDate;
  final String? gender;
  final String? locationCity;
  final String? locationState;
  final String? locationCountry;
  final String? bio;
  final String? profilePictureUrl;
  final String consciousIntention;
  final List<String> seekingConnections;
  final String? personalityType;
  final double trustScore;
  final bool isVerified;
  final DateTime createdAt;

  User({
    required this.id,
    required this.email,
    required this.name,
    this.birthDate,
    this.gender,
    this.locationCity,
    this.locationState,
    this.locationCountry,
    this.bio,
    this.profilePictureUrl,
    required this.consciousIntention,
    required this.seekingConnections,
    this.personalityType,
    required this.trustScore,
    required this.isVerified,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      birthDate: json['birthDate'],
      gender: json['gender'],
      locationCity: json['locationCity'],
      locationState: json['locationState'],
      locationCountry: json['locationCountry'],
      bio: json['bio'],
      profilePictureUrl: json['profilePictureUrl'],
      consciousIntention: json['consciousIntention'],
      seekingConnections: List<String>.from(json['seekingConnections'] ?? []),
      personalityType: json['personalityType'],
      trustScore: (json['trustScore'] ?? 0.5).toDouble(),
      isVerified: json['isVerified'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'birthDate': birthDate,
      'gender': gender,
      'locationCity': locationCity,
      'locationState': locationState,
      'locationCountry': locationCountry,
      'bio': bio,
      'profilePictureUrl': profilePictureUrl,
      'consciousIntention': consciousIntention,
      'seekingConnections': seekingConnections,
      'personalityType': personalityType,
      'trustScore': trustScore,
      'isVerified': isVerified,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

class EnergyVector {
  final Map<String, double> dimensions;
  final double magnitude;
  final String dominantElement;

  EnergyVector({
    required this.dimensions,
    required this.magnitude,
    required this.dominantElement,
  });

  factory EnergyVector.fromJson(Map<String, dynamic> json) {
    return EnergyVector(
      dimensions: Map<String, double>.from(json['dimensions']),
      magnitude: json['magnitude'].toDouble(),
      dominantElement: json['dominantElement'],
    );
  }
}

class PersonalityTestResult {
  final String id;
  final String userId;
  final EnergyVector energyVector;
  final String personalityType;
  final String archetypePrimary;
  final String archetypeSecondary;
  final double vibrationalFrequency;
  final DateTime completedAt;

  PersonalityTestResult({
    required this.id,
    required this.userId,
    required this.energyVector,
    required this.personalityType,
    required this.archetypePrimary,
    required this.archetypeSecondary,
    required this.vibrationalFrequency,
    required this.completedAt,
  });

  factory PersonalityTestResult.fromJson(Map<String, dynamic> json) {
    return PersonalityTestResult(
      id: json['id'],
      userId: json['userId'],
      energyVector: EnergyVector.fromJson(json['energyVector']),
      personalityType: json['personalityType'],
      archetypePrimary: json['archetypePrimary'],
      archetypeSecondary: json['archetypeSecondary'],
      vibrationalFrequency: json['vibrationalFrequency'].toDouble(),
      completedAt: DateTime.parse(json['completedAt']),
    );
  }
}
