## Resumo das alterações e código aplicados

Este arquivo reúne, de forma direta e objetiva, todas as alterações que foram feitas no projeto por mim (assistente) durante a sessão. Use isto como um checklist rápido para entender o que foi alterado e onde procurar no código.

### Entrada / App
- `app.tsx` — criado/ajustado como entrypoint canônico do app. Envolve `SafeAreaProvider`, `AuthProvider`, `ErrorBoundary` e `NavigationContainer`. Mantém `RootNavigator` que escolhe entre `AuthStack` e `AppStack`.

### Configuração Expo e scripts
- `package.json` — ajustado para o nome `helpbox` e `displayName` `HelpBox`. Scripts úteis: `start`, `android`, `ios`, `web`, `typecheck`, `lint`.
- `app.json` — configurado com `icon` e `splash` apontando para `assets/icon.png` e `adaptiveIcon` para Android.

### Tema e tokens
- `lib/theme.ts` — arquivo canônico de tokens: `colors`, `spacing`, `borderRadius`, `typography` (tipado com `TextStyle`). Objetivo: centralizar design tokens para consistência.

### Cabeçalho compartilhado
- `components/Header.tsx` — novo componente `Header` que:
	- Usa `SafeAreaView edges={["top"]}` para controlar o top inset.
	- Aceita props: `title`, `subtitle`, `left`, `right`, `showBack`, `onBack`, `bottomBorderColor`, `style`.
	- Exibe `assets/icon.png` quando não há `left` e não há botão de back.

### Telas atualizadas
- `screens/DashboardScreen.tsx` — passou a usar `Header` compartilhado; SafeArea configurado com `edges={["left","right","bottom"]}` (Header gerencia o top). Mostra `StatCard` e dicas.
- `screens/TicketScreen.tsx` — usa `Header` com `showBack` e `bottomBorderColor` para refletir cor do status; lista de tickets com `TicketCard`.
- `screens/ProfileScreen.tsx` — usa `Header`, mostra perfil, logout e preferências.
- `screens/UserGuideScreen.tsx` — usa `Header` e inclui manual do usuário dentro do app.
- `screens/LoginScreen.tsx` — mantém tela de autenticação com validações e demo login.

NOTA: A rota usada nas stacks chama a tela `TicketDetail` — confirme se o arquivo está nomeado `TicketDetailScreen.tsx` e não `TicketDetailsScreen.tsx` (mesmo nome usado nas rotas).

### Componentes reutilizáveis
- `components/StatCard.tsx` — card de estatísticas usado no dashboard.
- `components/TicketCard.tsx` — card de ticket com status, crítico, solicitante e data relativa.

### Autenticação e persistência
- `lib/authContext.tsx` — `AuthProvider` com `login`, `register`, `logout`, `bootstrapAsync`.
	- Usa `@react-native-async-storage/async-storage` quando disponível; caso contrário, fallback em memória para preview/demos.

### Mock data e testes locais
- `lib/mockData.ts` — `mockTickets`, `mockUsers`, `mockCredentials` (inclui credenciais de demo `demo@example.com / demo123`).

### Utilitários
- `lib/utils.ts` — formatadores de data (`formatDate`, `formatRelativeDate`), mapeamentos de labels e cores (`getStatusLabel`, `getStatusColor`, `getSeverityLabel`, `getSeverityColor`), validações de formulário (`validateEmail`, `validatePassword`, `validateLoginForm`, `validateRegisterForm`).

### Erros encontrados e correções aplicadas
- Problema: Metro bundler não resolvia `App` — solução: criar `app.tsx` como entry canônico e manter `package.json` com `main` apontando para `node_modules/expo/AppEntry.js`.
- Problema: conflitos/casing e arquivos de theme malformados — solução: consolidar e reescrever `lib/theme.ts` com tipos corretos.
- Problema: header sobrando espaço com notch — solução: criar `Header` que consome `top` safe area e ajustar as telas para não consumir `top` (usar `edges` apropriados).

### Branding
- Nome e strings foram atualizados para `HelpBox` em `package.json`, `app.json` e telas onde aplicável. `assets/icon.png` é usado como logo no `Header` e no splash.

### Observações importantes para desenvolvimento
- Sempre reiniciar o bundler após trocar assets (ícone/splash): `expo start -c`.
- Rodar `npm run typecheck` regularmente para capturar problemas TypeScript.
- Se a tela de `TicketDetail` estiver ausente, crie `screens/TicketDetailScreen.tsx` conforme a rota.

---

Arquivo atualizado pelo assistente: este `doc.md` (resumo) — para documentação completa e instruções estendidas veja `manual.md`.

## Arquitetura e fluxo principal

`app.tsx` — raiz do app. Usa:

- `SafeAreaProvider` (do `react-native-safe-area-context`),
- `AuthProvider` (contexto de autenticação),
- `ErrorBoundary` (captura erros de render),
- `NavigationContainer` com `RootNavigator` que decide entre stack de autenticação e stack da aplicação (Dashboard + Tickets + TicketDetail + Profile + UserGuide).

Autenticação:

- `authContext.tsx` mantém sessão (tenta restaurar de `AsyncStorage`, com fallback em memória quando `AsyncStorage` não está presente).
- Métodos: `login`, `register`, `logout`.

Dados:

- `mockData.ts` contém `mockTickets`, `mockUsers` e `mockCredentials` — usado para desenvolvimento sem backend real.

UI / Camada visual:

- `theme.ts` contém tokens (`colors`, `spacing`, `borderRadius`, `typography`).
- `Header.tsx` é o cabeçalho compartilhado que gerencia a SafeArea superior e exibe logo quando apropriado.
- `StatCard.tsx` e `TicketCard.tsx` são componentes reutilizáveis de UI.

Utilitários:

- `utils.ts` contém formatação de data, labels e validações (email/senha), helpers de cor/label para status/criticidade.

Navegação:

- `@react-navigation/native` + `@react-navigation/native-stack` — navegação por stacks, telas definidas em `app.tsx`/stack.

## Arquivos principais (resumo por arquivo)

Orientação curta por arquivo — onde localizar e propósito:

- `package.json`

	- Dependências, scripts (`start`/`typecheck`/`lint`). Versão do `expo` está ali. Mantenha coerência entre `expo` e `react-native` se atualizar SDK.

- `app.json`

	- Configuração Expo: ícone (`icon.png`), splash, `adaptiveIcon` (Android).

- `app.tsx`

	- Entrypoint React — `SafeAreaProvider` + `AuthProvider` + `NavigationContainer` + `ErrorBoundary`. Contém `RootNavigator` que alterna entre `AuthStack` e `AppStack`.

- `theme.ts`

	- Tokens de design: `colors`, `spacing`, `borderRadius`, `typography` (tipos `TextStyle`). Use este arquivo para troca de cor, espaçamento, etc.

- `authContext.tsx`

	- Contexto de autenticação e persistência de sessão (usa `AsyncStorage` quando disponível; fallback em memória em ambientes de preview).

- `utils.ts`

	- Funções utilitárias: `formatDate`/`formatRelativeDate`, `getStatusLabel`/`getStatusColor`, `getSeverityLabel`/`getSeverityColor`, validações de formulários, agrupamento de tickets.

- `mockData.ts`

	- Dados de desenvolvimento (tickets, usuários, credenciais demo). Bom ponto de partida para conectar a uma API real.

- `Header.tsx`

	- Header central. Propriedades: `title`, `subtitle`, `left`, `right`, `showBack`, `onBack`, `bottomBorderColor`.
	- Importante: ele envolve um `SafeAreaView edges={["top"]}` — portanto as telas que usam o `Header` deveriam NÃO consumir o top safe area (para evitar espaço duplicado). Atualmente as telas configuradas passam `edges={["left","right","bottom"]}` para manter `Header` como dono do top.

- `StatCard.tsx`

	- Card estatístico usado no Dashboard. Recebe `label`, `count`, `color`, `icon`, `onPress`.

- `TicketCard.tsx`

	- Card de ticket para listas. Exibe `id`, `status`, `title`, `requester`, `severity` e `createdAt` (data relativa).

- `screens/*`

	- `DashboardScreen.tsx` — mostra `StatCards` e dicas rápidas. Usa `Header` com ações à direita.
	- `LoginScreen.tsx` — tela de login/registro, com validações e demo login (`demo@example.com / demo123`).
	- `TicketScreen.tsx` (Tickets) — lista filtrada por status com `Header` mostrando back e cor de status.
	- `TicketDetailScreen.tsx` — (possivelmente faltante no repo — ver observação abaixo) tela de detalhes do ticket.
	- `ProfileScreen.tsx` — perfil do usuário e logout.
	- `UserGuideScreen.tsx` — manual do usuário in-app.

	Observação: no readme da conversa apareceu `TicketDetailsScreen.tsx` (ou `TicketDetailScreen.tsx`) — verifique se o caminho preciso no projeto é `TicketDetailScreen.tsx` (como usado nas rotas) — caso falte, criar tela fará com que a navegação não quebre.

- `index.ts` (tipagens)

	- Tipagens do app (Tipagem de `Ticket`, `User`, `RootStackParamList`, `AuthSession`). Essas tipagens orientam as props de navegação e o context.

## Pontos importantes / decisões de implementação

- Header central controla top SafeArea:

	- Para evitar sobreposição com notch e dupla margem, as telas foram ajustadas para não consumir `top` do `SafeArea`; o `Header` é o único que consome `top`.

- AsyncStorage fallback:

	- Em ambientes de preview (onde `AsyncStorage` pode não estar disponível), o auth provider usa um fallback em memória — útil para demos no Expo web / snack.

- Mock data:

	- Atualmente o app é offline-first com dados mockados. Trocar para backend exige alterações em `mockData.ts` e possivelmente um serviço (`axios`) com `lib/api.ts`.

- Typography e tokens:

	- `typography` usa `TextStyle` para evitar erros de tipagem com `fontWeight` etc.

## Test credentials

- demo account: email `demo@example.com` / senha `demo123`
- outros usuários de mock: ver `mockData.ts` (`joao.silva@company.com`, etc.)

## Como estender (checklist rápido)

1. Adicionar backend real:

	 - Criar `lib/api.ts` com instância `axios`, endpoints: `/login`, `/tickets`, `/ticket/:id`.
	 - Substituir `mockData` por fetches e atualizar `AuthProvider` para gravar token/refresh token.
	 - Implementar camada de revalidação e tratamento de offline.

2. Adicionar tela de detalhes:

	 - Se `TicketDetail` estiver faltando, criar `TicketDetailScreen.tsx` e mapear rota em `app.tsx`.

3. Dark mode:

	 - `theme.ts` pode ganhar `dark` export com tokens alternativos; criar `ThemeProvider` para trocar dinamicamente.

4. Internacionalização:

	 - Extrair strings para arquivo `i18n/pt-BR.json` e usar uma lib de i18n.

## Debug e troubleshooting (problemas comuns)

- App não inicia / "Unable to resolve '../../App'":

	- Certifique-se que `app.tsx` existe e `package.json` `main` aponta para `node_modules/expo/AppEntry.js` (padrão). Expo procura `App` export default; `app.tsx` deve exportar default.

- Assets não aparecem / ícone não carregado:

	- Confirme caminho relativo `assets/icon.png` e que o arquivo existe. Se alterou a imagem, reinicie bundler com `expo start -c`.

- Erros de tipagem (TS):

	- Rodar `npm run typecheck` e resolver erros indicados; tipicamente vêm de imports com nomes/paths incorretos ou de tokens do theme.

- SafeArea duplicado (espaço extra no topo):

	- Verifique se ambos `Header` e a tela usam `edges` incluindo `top`. As telas que usam o `Header` devem evitar consumir `top` (ex.: `edges={["left","right","bottom"]}`).

- AsyncStorage ausente em ambiente preview:

	- `authContext.tsx` tem fallback em memória — comportamento esperado em alguns ambientes (expo web / snack). Para persistência real, garantir `@react-native-async-storage/async-storage` instalado e disponível.

## Recomendações / próximos passos (prioritários)

- (Se desejar publicar) Atualizar a versão do SDK Expo de acordo com a versão do `expo` no `package.json`. Testar o app em device físico/emulador.
- Subir testes unitários mínimos (por exemplo com Jest) para `utils.ts` e validar form validators / formatters.
- Converter mock data para um pequeno service que pode ser trocado por um backend remoto sem impactar UI (Repository Pattern).
- Adicionar CI básico (GitHub Actions) para rodar `npm ci`, `npm run typecheck`, `npm run lint` em PRs.
- Fazer uma checagem completa de tipagens (`npm run typecheck`) e endereçar warnings do Expo (por exemplo SafeAreaView de RN vs safe-area-context).

