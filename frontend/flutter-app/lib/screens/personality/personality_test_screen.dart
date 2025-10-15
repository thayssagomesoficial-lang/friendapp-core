import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/user_provider.dart';

class PersonalityTestScreen extends StatefulWidget {
  const PersonalityTestScreen({super.key});

  @override
  State<PersonalityTestScreen> createState() => _PersonalityTestScreenState();
}

class _PersonalityTestScreenState extends State<PersonalityTestScreen> {
  final PageController _pageController = PageController();
  final Map<String, dynamic> _answers = {};
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<UserProvider>(context, listen: false).loadPersonalityQuestions();
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextQuestion() {
    if (_currentPage < _getQuestions().length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _submitTest();
    }
  }

  void _previousQuestion() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  List<Map<String, dynamic>> _getQuestions() {
    return Provider.of<UserProvider>(context, listen: false).personalityQuestions;
  }

  Future<void> _submitTest() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final answersList = _answers.entries
        .map((entry) => {'questionId': entry.key, 'answer': entry.value})
        .toList();

    final success = await userProvider.submitPersonalityTest(answersList);

    if (success && mounted) {
      context.go('/home');
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Erro ao processar teste'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Teste de Personalidade Energética'),
      ),
      body: Consumer<UserProvider>(
        builder: (context, userProvider, _) {
          if (userProvider.isLoading && userProvider.personalityQuestions.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          final questions = userProvider.personalityQuestions;
          if (questions.isEmpty) {
            return const Center(
              child: Text('Erro ao carregar perguntas'),
            );
          }

          return Column(
            children: [
              LinearProgressIndicator(
                value: (_currentPage + 1) / questions.length,
              ),
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  onPageChanged: (page) {
                    setState(() {
                      _currentPage = page;
                    });
                  },
                  itemCount: questions.length,
                  itemBuilder: (context, index) {
                    final question = questions[index];
                    return _buildQuestionPage(question);
                  },
                ),
              ),
              _buildNavigationButtons(),
            ],
          );
        },
      ),
    );
  }

  Widget _buildQuestionPage(Map<String, dynamic> question) {
    final questionId = question['id'];
    final questionText = question['question'];
    final questionType = question['type'];
    final options = List<Map<String, dynamic>>.from(question['options']);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 24),
          Text(
            questionText,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 32),
          if (questionType == 'single')
            ...options.map((option) {
              final value = option['value'];
              final text = option['text'];
              final isSelected = _answers[questionId] == value;

              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _answers[questionId] = value;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: isSelected
                            ? Theme.of(context).colorScheme.primary
                            : Colors.grey.shade300,
                        width: isSelected ? 2 : 1,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      color: isSelected
                          ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                          : null,
                    ),
                    child: Row(
                      children: [
                        Radio<String>(
                          value: value,
                          groupValue: _answers[questionId],
                          onChanged: (val) {
                            setState(() {
                              _answers[questionId] = val;
                            });
                          },
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            text,
                            style: TextStyle(
                              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList()
          else
            ...options.map((option) {
              final value = option['value'];
              final text = option['text'];
              final currentAnswers = _answers[questionId] as List? ?? [];
              final isSelected = currentAnswers.contains(value);

              return Padding(
                padding: const EdgeInsets.only(bottom: 12.0),
                child: InkWell(
                  onTap: () {
                    setState(() {
                      final list = List.from(currentAnswers);
                      if (isSelected) {
                        list.remove(value);
                      } else {
                        list.add(value);
                      }
                      _answers[questionId] = list;
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: isSelected
                            ? Theme.of(context).colorScheme.primary
                            : Colors.grey.shade300,
                        width: isSelected ? 2 : 1,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      color: isSelected
                          ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                          : null,
                    ),
                    child: Row(
                      children: [
                        Checkbox(
                          value: isSelected,
                          onChanged: (val) {
                            setState(() {
                              final list = List.from(currentAnswers);
                              if (val == true) {
                                list.add(value);
                              } else {
                                list.remove(value);
                              }
                              _answers[questionId] = list;
                            });
                          },
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            text,
                            style: TextStyle(
                              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
        ],
      ),
    );
  }

  Widget _buildNavigationButtons() {
    final questions = _getQuestions();
    final currentQuestion = questions[_currentPage];
    final questionId = currentQuestion['id'];
    final hasAnswer = _answers.containsKey(questionId) && 
        (_answers[questionId] != null && 
         (_answers[questionId] is! List || (_answers[questionId] as List).isNotEmpty));

    return Container(
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        children: [
          if (_currentPage > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: _previousQuestion,
                child: const Text('Voltar'),
              ),
            ),
          if (_currentPage > 0) const SizedBox(width: 16),
          Expanded(
            flex: 2,
            child: FilledButton(
              onPressed: hasAnswer ? _nextQuestion : null,
              child: Text(
                _currentPage == questions.length - 1
                    ? 'Finalizar'
                    : 'Próxima',
              ),
            ),
          ),
        ],
      ),
    );
  }
}
