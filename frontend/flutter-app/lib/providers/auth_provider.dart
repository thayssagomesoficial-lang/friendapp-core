import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/user_model.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  User? _currentUser;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _error;

  User? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();

    try {
      final token = await _apiService.getToken();
      if (token != null) {
        final user = await _apiService.getProfile();
        _currentUser = user;
        _isAuthenticated = true;
      }
    } catch (e) {
      _isAuthenticated = false;
      await _apiService.deleteToken();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> register({
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
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _apiService.register(
        email: email,
        password: password,
        name: name,
        birthDate: birthDate,
        consciousIntention: consciousIntention,
        seekingConnections: seekingConnections,
        gender: gender,
        locationCity: locationCity,
        locationState: locationState,
      );

      _currentUser = User.fromJson(data['user']);
      _isAuthenticated = true;
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

  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _apiService.login(
        email: email,
        password: password,
      );

      _currentUser = User.fromJson(data['user']);
      _isAuthenticated = true;
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

  Future<void> logout() async {
    await _apiService.deleteToken();
    _currentUser = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}
