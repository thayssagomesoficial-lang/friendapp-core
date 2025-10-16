import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<NavigationDestination> _destinations = const [
    NavigationDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: 'Início',
    ),
    NavigationDestination(
      icon: Icon(Icons.explore_outlined),
      selectedIcon: Icon(Icons.explore),
      label: 'Explorar',
    ),
    NavigationDestination(
      icon: Icon(Icons.people_outline),
      selectedIcon: Icon(Icons.people),
      label: 'Conexões',
    ),
    NavigationDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person),
      label: 'Perfil',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _HomeTab(),
          _ExploreTab(),
          _ConnectionsTab(),
          _ProfileTab(),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: _destinations,
      ),
    );
  }
}

class _HomeTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).currentUser;

    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 200,
          pinned: true,
          flexibleSpace: FlexibleSpaceBar(
            title: Text('Olá, ${user?.name.split(' ')[0] ?? 'Usuário'}'),
            background: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Theme.of(context).colorScheme.primary,
                    Theme.of(context).colorScheme.secondary,
                  ],
                ),
              ),
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.all(16),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              if (user?.personalityType != null) ...[
                _PersonalityCard(
                  type: user!.personalityType!,
                  intention: user.consciousIntention,
                ),
                const SizedBox(height: 16),
              ],
              _QuickActionsCard(),
              const SizedBox(height: 16),
              const Text(
                'Feed Sensorial',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => context.go('/feed'),
                child: const Text('Ver feed completo →'),
              ),
            ]),
          ),
        ),
      ],
    );
  }
}

class _PersonalityCard extends StatelessWidget {
  final String type;
  final String intention;

  const _PersonalityCard({
    required this.type,
    required this.intention,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.auto_awesome,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                Text(
                  'Seu Perfil Energético',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                type,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Intenção Consciente:',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 4),
            Text(intention),
          ],
        ),
      ),
    );
  }
}

class _QuickActionsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Ações Rápidas',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _ActionButton(
                  icon: Icons.feed,
                  label: 'Feed',
                  onTap: () => context.go('/feed'),
                ),
                _ActionButton(
                  icon: Icons.people,
                  label: 'Conexões',
                  onTap: () {},
                ),
                _ActionButton(
                  icon: Icons.map,
                  label: 'Mapa',
                  onTap: () {},
                ),
                _ActionButton(
                  icon: Icons.gamepad,
                  label: 'Jogo',
                  onTap: () {},
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            Icon(icon, size: 32),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}

class _ExploreTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Explorar (Em breve)'),
    );
  }
}

class _ConnectionsTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Text('Conexões (Em breve)'),
    );
  }
}

class _ProfileTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const SizedBox(height: 32),
        Center(
          child: CircleAvatar(
            radius: 50,
            child: Text(
              user?.name[0].toUpperCase() ?? 'U',
              style: const TextStyle(fontSize: 36),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          user?.name ?? '',
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          user?.email ?? '',
          style: TextStyle(
            color: Colors.grey,
          ),
          textAlign: TextAlign.center,
        ),
        if (user?.personalityType != null) ...[
          const SizedBox(height: 16),
          Chip(
            label: Text(user!.personalityType!),
            avatar: const Icon(Icons.auto_awesome, size: 18),
          ),
        ],
        const SizedBox(height: 32),
        ListTile(
          leading: const Icon(Icons.person_outline),
          title: const Text('Editar Perfil'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () {},
        ),
        ListTile(
          leading: const Icon(Icons.psychology_outlined),
          title: const Text('Refazer Teste de Personalidade'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () => context.go('/personality-test'),
        ),
        ListTile(
          leading: const Icon(Icons.settings_outlined),
          title: const Text('Configurações'),
          trailing: const Icon(Icons.chevron_right),
          onTap: () {},
        ),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.logout, color: Colors.red),
          title: const Text(
            'Sair',
            style: TextStyle(color: Colors.red),
          ),
          onTap: () async {
            await authProvider.logout();
            if (context.mounted) {
              context.go('/auth/login');
            }
          },
        ),
      ],
    );
  }
}
