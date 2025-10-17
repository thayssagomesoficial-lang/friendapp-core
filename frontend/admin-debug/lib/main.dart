import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const AdminDebugApp());
}

class AdminDebugApp extends StatelessWidget {
  const AdminDebugApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FriendApp Admin Debug',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const AdminDebugScreen(),
    );
  }
}

class AdminDebugScreen extends StatefulWidget {
  const AdminDebugScreen({super.key});

  @override
  State<AdminDebugScreen> createState() => _AdminDebugScreenState();
}

class _AdminDebugScreenState extends State<AdminDebugScreen> {
  final String gatewayUrl = 'http://localhost:3000';
  final TextEditingController _userIdController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  String? _authToken;
  String _output = '';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _userIdController.text = '550e8400-e29b-41d4-a716-446655440000';
    _emailController.text = 'admin@friendapp.com';
  }

  void _setOutput(String message) {
    setState(() {
      _output = message;
    });
  }

  void _appendOutput(String message) {
    setState(() {
      _output += '\n$message';
    });
  }

  Future<void> _authenticate() async {
    setState(() {
      _isLoading = true;
      _output = 'Autenticando...';
    });

    try {
      final response = await http.post(
        Uri.parse('$gatewayUrl/api/v1/auth/token'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': _userIdController.text,
          'email': _emailController.text,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _authToken = data['token'];
          _output = '✅ Token obtido com sucesso!\nToken: ${_authToken!.substring(0, 20)}...';
        });
      } else {
        _setOutput('❌ Erro ao autenticar: ${response.statusCode}');
      }
    } catch (e) {
      _setOutput('❌ Erro: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _criarAtribuirSelo() async {
    if (_authToken == null) {
      _setOutput('❌ Faça login primeiro!');
      return;
    }

    setState(() {
      _isLoading = true;
      _output = '🔖 Criando selo...';
    });

    try {
      final createResponse = await http.post(
        Uri.parse('$gatewayUrl/api/v1/selos/criar'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_authToken',
        },
        body: jsonEncode({
          'tipo': 'verificacao_identidade',
          'user_id': _userIdController.text,
        }),
      );

      if (createResponse.statusCode == 201) {
        final data = jsonDecode(createResponse.body);
        final seloId = data['selo_id'];
        _appendOutput('✅ Selo criado: $seloId');

        _appendOutput('\n🎯 Atribuindo selo...');

        final assignResponse = await http.post(
          Uri.parse('$gatewayUrl/api/v1/selos/atribuir'),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $_authToken',
          },
          body: jsonEncode({
            'user_id': _userIdController.text,
            'selo_id': seloId,
          }),
        );

        if (assignResponse.statusCode == 200) {
          _appendOutput('✅ Selo atribuído com sucesso!');
        } else {
          _appendOutput('❌ Erro ao atribuir selo: ${assignResponse.statusCode}');
        }
      } else {
        _appendOutput('❌ Erro ao criar selo: ${createResponse.statusCode}');
      }
    } catch (e) {
      _appendOutput('❌ Erro: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _simularVerificacao() async {
    if (_authToken == null) {
      _setOutput('❌ Faça login primeiro!');
      return;
    }

    setState(() {
      _isLoading = true;
      _output = '🔍 Simulando verificação...';
    });

    try {
      final response = await http.post(
        Uri.parse('$gatewayUrl/api/v1/verificacao/iniciar'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_authToken',
        },
        body: jsonEncode({
          'user_id': _userIdController.text,
          'tipo_verificacao': 'DUC',
          'documento': '12345678900',
          'selfie_url': 'https://example.com/selfie.jpg',
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _appendOutput('✅ Verificação simulada!');
        _appendOutput('Status: ${data['status']}');
        _appendOutput('Provider: ${data['provider']}');
      } else {
        _appendOutput('❌ Erro: ${response.statusCode}');
      }
    } catch (e) {
      _appendOutput('❌ Erro: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _verScoreReputacao() async {
    if (_authToken == null) {
      _setOutput('❌ Faça login primeiro!');
      return;
    }

    setState(() {
      _isLoading = true;
      _output = '📊 Calculando reputação...';
    });

    try {
      final calcResponse = await http.post(
        Uri.parse('$gatewayUrl/api/v1/reputacao/calcular'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_authToken',
        },
        body: jsonEncode({
          'user_id': _userIdController.text,
          'coerencia': 0.8,
          'reciprocidade': 0.7,
          'feedbacks_positivos': 10,
          'denuncias_validadas': 0,
          'maturity_days': 30,
        }),
      );

      if (calcResponse.statusCode == 200) {
        final data = jsonDecode(calcResponse.body);
        _appendOutput('✅ Score calculado!');
        _appendOutput('Score: ${data['score']}');
        _appendOutput('Estado: ${data['estado']}');
        
        _appendOutput('\n📈 Obtendo dados completos...');
        
        final getResponse = await http.get(
          Uri.parse('$gatewayUrl/api/v1/reputacao/usuario/${_userIdController.text}'),
          headers: {
            'Authorization': 'Bearer $_authToken',
          },
        );

        if (getResponse.statusCode == 200) {
          final userData = jsonDecode(getResponse.body);
          _appendOutput('Coerência: ${userData['coherence']}');
          _appendOutput('Reciprocidade: ${userData['reciprocity']}');
          _appendOutput('Feedbacks Positivos: ${userData['feedbacks_positive']}');
        }
      } else {
        _appendOutput('❌ Erro: ${calcResponse.statusCode}');
      }
    } catch (e) {
      _appendOutput('❌ Erro: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FriendApp - Admin Debug'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 1,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Configuração',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _userIdController,
                        decoration: const InputDecoration(
                          labelText: 'User ID',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: _isLoading ? null : _authenticate,
                        icon: const Icon(Icons.login),
                        label: const Text('Autenticar'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 16),
                      const Text(
                        'Ações',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: _isLoading ? null : _criarAtribuirSelo,
                        icon: const Icon(Icons.badge),
                        label: const Text('Criar/Atribuir Selo'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        onPressed: _isLoading ? null : _simularVerificacao,
                        icon: const Icon(Icons.verified_user),
                        label: const Text('Simular Verificação'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        onPressed: _isLoading ? null : _verScoreReputacao,
                        icon: const Icon(Icons.star),
                        label: const Text('Ver Score Reputação'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                          backgroundColor: Colors.orange,
                          foregroundColor: Colors.white,
                        ),
                      ),
                      if (_isLoading)
                        const Padding(
                          padding: EdgeInsets.only(top: 16),
                          child: LinearProgressIndicator(),
                        ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              flex: 2,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Output',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          IconButton(
                            onPressed: () => setState(() => _output = ''),
                            icon: const Icon(Icons.clear),
                            tooltip: 'Limpar output',
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.grey[900],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: SingleChildScrollView(
                            child: Text(
                              _output.isEmpty ? 'Aguardando ação...' : _output,
                              style: const TextStyle(
                                fontFamily: 'monospace',
                                color: Colors.greenAccent,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _userIdController.dispose();
    _emailController.dispose();
    super.dispose();
  }
}
