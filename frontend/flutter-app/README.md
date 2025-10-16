# FriendApp Flutter

Aplicativo mobile e web do FriendApp construído com Flutter.

## Características

- **Autenticação**: Login e registro com intenção consciente
- **Teste de Personalidade**: 10 perguntas mapeando 7 dimensões vibracionais
- **Feed Sensorial**: Feed inteligente com ranking baseado em ressonância
- **Perfil de Usuário**: Visualização e edição de perfil energético

## Pré-requisitos

- Flutter 3.x ou superior
- Dart 3.x ou superior

## Instalação

```bash
# Instalar dependências
flutter pub get

# Executar no Chrome (Web)
flutter run -d chrome

# Executar no Android
flutter run -d android

# Executar no iOS
flutter run -d ios
```

## Configuração da API

O app está configurado para se conectar ao backend em `http://localhost:3000/api/v1`.

Para alterar a URL da API, edite:
```dart
// lib/services/api_service.dart
static const String baseUrl = 'SEU_BACKEND_URL/api/v1';
```

## Estrutura do Projeto

```
lib/
├── main.dart                 # Entry point
├── models/                   # Modelos de dados
│   ├── user_model.dart
│   └── post_model.dart
├── providers/                # State management (Provider)
│   ├── auth_provider.dart
│   ├── user_provider.dart
│   └── feed_provider.dart
├── screens/                  # Telas da aplicação
│   ├── splash_screen.dart
│   ├── auth/
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── personality/
│   │   └── personality_test_screen.dart
│   ├── home/
│   │   └── home_screen.dart
│   ├── feed/
│   │   └── feed_screen.dart
│   └── profile/
│       └── profile_screen.dart
└── services/                 # Serviços
    └── api_service.dart      # Cliente HTTP
```

## Build para Produção

### Web
```bash
flutter build web
```

### Android
```bash
flutter build apk
# ou
flutter build appbundle
```

### iOS
```bash
flutter build ios
```

## Próximos Passos

- [ ] Implementar chat de conexões
- [ ] Adicionar mapa de frequência
- [ ] Implementar jogo da transmutação
- [ ] Adicionar notificações push
- [ ] Implementar upload de imagens
