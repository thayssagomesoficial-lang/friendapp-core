import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/user_model.dart';

class UserProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  PersonalityTestResult? _personalityResult;
  List<Map<String, dynamic>> _personalityQuestions = [];
  bool _isLoading = false;
  String? _error;

  PersonalityTestResult? get personalityResult => _personalityResult;
  List<Map<String, dynamic>> get personalityQuestions => _personalityQuestions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadPersonalityQuestions() async {
    _isLoading = true;
    notifyListeners();

    try {
      _personalityQuestions = await _apiService.getPersonalityQuestions();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> submitPersonalityTest(List<Map<String, dynamic>> answers) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _personalityResult = await _apiService.submitPersonalityTest(answers: answers);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
