# Manual completo do projeto — HelpBox

Última atualização: 29 de outubro de 2025

Este manual documenta o código, arquitetura, instruções de execução, componentes principais e recomendações para desenvolvimento futuro do projeto HelpBox (React Native + Expo).

## Sumário
- Visão geral
- Como rodar (Windows / PowerShell)
- Arquitetura e fluxo
- Arquivos e responsabilidades (arquivo-a-arquivo)
- Componentes principais
- Tema e tokens
- Autenticação (AuthProvider)
- Mock data e como migrar para API real
- Boas práticas e troubleshooting
- Checklist de PR / testes
- Próximos passos recomendados

---

## Sumário explicado (termos em inglês com explicação em português)

Esta seção descreve e traduz os termos técnicos em inglês usados no manual para que você possa explicá-los com facilidade.

- Entrypoint / App entry: ponto de entrada da aplicação — o arquivo onde o React inicia (aqui `app.tsx`).
- SafeAreaProvider: provedor que controla as áreas seguras da tela (notch, status bar). Ele permite que componentes saibam onde não desenhar conteúdo sensível.
- AuthProvider: provedor de autenticação — componente que guarda o estado do usuário (logado/não logado) e expõe funções como `login`/`logout`.
- ErrorBoundary: componente que captura erros de renderização para mostrar uma tela amigável em vez de quebrar o app.
- NavigationContainer / native-stack: contêiner e implementação de navegação (stack) do React Navigation — gerenciam telas e histórico de navegação.
- RootNavigator / AuthStack / AppStack: nomes usados para organizar rotas; `AuthStack` contém telas de login, `AppStack` contém telas autenticadas.
- AsyncStorage: armazenamento persistente local no dispositivo (chave/valor). Usado para salvar sessões/token. No web/preview pode não existir.
- mockData: dados falsos (simulados) usados em desenvolvimento quando não há backend.
- Tokens (colors, spacing, typography): valores reutilizáveis de design (cores, espaçamentos, tamanhos de fonte) para manter consistência visual.
- SafeArea / edges: propriedades que indicam quais bordas (top, bottom, left, right) o componente deve respeitar em relação às áreas seguras.
- Header: cabeçalho compartilhado do app (barra superior com título, botões e logo).
- StatCard / TicketCard: componentes de interface que mostram informações compactas (estatísticas e resumo de ticket).
- CI (Continuous Integration): integração contínua — pipeline automatizado (ex.: GitHub Actions) que roda testes, linter e typecheck em cada PR.
- Jest / @testing-library/react-native: ferramentas para escrever testes automatizados (unitários e de interface) para React Native.
- Axios / lib/api.ts: `axios` é biblioteca para fazer requisições HTTP; `lib/api.ts` seria onde centralizaríamos chamadas à API.
- Dark mode: modo escuro — tema alternativo com cores apropriadas para ambientes com pouca luz.
- i18n (internacionalização): suporte a múltiplos idiomas; normalmente armazenado em arquivos `i18n/pt-BR.json` etc.
- Expo / Metro bundler: Expo é a plataforma/CLI para executar apps RN; Metro é o bundler que empacota o JS. Comandos: `expo start`, `expo start -c`.
- Splash / adaptiveIcon: splash = tela inicial exibida enquanto o app carrega; adaptiveIcon é o ícone adaptável do Android.
- TypeScript typecheck / lint: checagem de tipos e formatação/estilo do código. Comandos no `package.json`: `typecheck` e `lint`.
- Repository Pattern: padrão arquitetural para isolar acesso a dados (facilita trocar mock/local por backend remoto).

Se quiser, eu também posso gerar um arquivo curto `glossary.md` com essas explicações isoladas para imprimir ou enviar a colegas.

---

## Visão geral
HelpBox é um aplicativo de gestão/visualização de chamados (tickets) construído com React Native e Expo. O projeto foi preparado para rodar com Expo, possui um tema centralizado e um `Header` compartilhado que controla o safe-area superior para evitar problemas com notches. Atualmente trabalha com dados mock (offline) para facilitar desenvolvimento.

## Como rodar (Windows / PowerShell)
Abra um terminal PowerShell no diretório do projeto (`c:\Users\breno\OneDrive\Documents\app2`) e rode os comandos abaixo.

Instalar dependências:
```powershell
npm install
```

Iniciar o bundler Expo:
```powershell
npm start
# ou para limpar cache
npx expo start -c
```

Rodar checagem TypeScript (sem emitir arquivos):
```powershell
npm run typecheck
```

Rodar linter (se configurado):
```powershell
npm run lint
```

Observação sobre assets: se trocar `assets/icon.png` ou qualquer asset, reinicie o bundler com `expo start -c`.

---

## Arquitetura e fluxo

- Entrypoint: `app.tsx`. O app envolve `SafeAreaProvider`, `AuthProvider`, `ErrorBoundary` e `NavigationContainer`.
- `RootNavigator` decide entre `AuthStack` (login) e `AppStack` (Dashboard, Tickets, TicketDetail, Profile, UserGuide) com base no estado de autenticação do `AuthProvider`.
- UI: componentes reaproveitáveis (`StatCard`, `TicketCard`, `Header`) e telas compostas (Dashboard, Tickets, Profile, Login, UserGuide).
- Tema central: `lib/theme.ts` contendo tokens reutilizáveis.

---

## Arquivos e responsabilidades (arquivo-a-arquivo)

Breve explicação de cada arquivo/fonte relevante e onde procurar para modificar comportamento.

- `app.tsx`
	- Ponto de partida do app. Configura providers e navegação.
	- Se for preciso adicionar novos providers (i18n, state managers), faça aqui.

- `package.json`
	- Scripts úteis: `start`, `android`, `ios`, `web`, `typecheck`, `lint`.
	- Dependências principais: `expo`, `react`, `react-native`, `@react-navigation/*`, `react-native-safe-area-context`.

- `app.json`
	- Configura ícone/splash/expo plugins. Atualize se for publicar na loja.

- `lib/theme.ts`
	- Tokens de design: `colors`, `spacing`, `borderRadius`, `typography`.
	- Usar para padronizar estilo e facilitar implementação de dark mode no futuro.

- `lib/authContext.tsx`
	- Contexto de autenticação com persistência (AsyncStorage com fallback em memória) e métodos: `login`, `register`, `logout`.
	- Modificar para integração com backend na função `login` e `bootstrapAsync` (restauração da sessão).

- `lib/utils.ts`
	- Helpers para formatação de datas, labels e validações de formulário.

- `lib/mockData.ts`
	- Dados de exemplo (tickets, usuários, credenciais). Swap por chamadas reais em `lib/api.ts` quando migrar.

- `components/Header.tsx`
	- Header compartilhado. Controla safe area top (usar `edges={["top"]}`) e layout de título/ações.

- `components/StatCard.tsx`
	- Card de estatísticas utilizado no dashboard.

- `components/TicketCard.tsx`
	- Card da lista de tickets com status, criticidade e data relativa.

- `screens/*` (Dashboard, Login, Tickets, TicketDetail, Profile, UserGuide)
	- Telas principais. Observação: rotas usam `TicketDetail` — confirme nome do arquivo.

---

## Componentes principais (detalhes)

- Header (`components/Header.tsx`)
	- Props: `title`, `subtitle`, `left`, `right`, `showBack`, `onBack`, `bottomBorderColor`, `style`.
	- Renderiza um `SafeAreaView edges={["top"]}` e uma barra com left/center/right.
	- Caso não exista `left` nem `showBack`, exibe o logo `assets/icon.png`.

- StatCard (`components/StatCard.tsx`)
	- Props: `label`, `count`, `color`, `icon`, `onPress`.
	- Usado no Dashboard para acesso rápido às listas filtradas.

- TicketCard (`components/TicketCard.tsx`)
	- Exibe `id`, `status`, `title`, `requester`, `severity`, `createdAt`.
	- Usa `lib/utils` para labels/cores e `lib/theme` para tokens.

---

## Tema e tokens (`lib/theme.ts`)

- Centralize cores, espaçamentos, bordas e tipografia.
- Tipografia está tipada como `TextStyle` para evitar erros de tipagem.
- Para adicionar dark mode: criar um segundo conjunto de tokens (`theme.dark.ts`) e um `ThemeContext` ou usar uma lib como `react-native-paper` ou `native-base`.

---

## Autenticação — `lib/authContext.tsx`

- Fluxo atual: `bootstrapAsync` (restaura sessão), `login` (valida contra `mockCredentials`), `register` (cria sessão em memória), `logout`.
- Para integrar com backend real:
	1. Criar `lib/api.ts` com instância axios e interceptors para injetar token.
	2. Em `login`, chamar o endpoint `/auth/login` e salvar token + usuário em AsyncStorage.
	3. `bootstrapAsync` deve validar token (refresh se necessário) e popular `user` no contexto.

---

## Mock data e migração para API

- Atalho: `lib/mockData.ts` é usado diretamente nas telas. Para migrar:
	1. Criar `lib/api.ts` (axios). Ex.:
		 ```ts
		 import axios from 'axios';
		 export const api = axios.create({ baseURL: 'https://api.suaempresa.com' });
		 ```
	2. Substituir chamadas diretas a `mockTickets` por chamadas `await api.get('/tickets')`;
	3. Ajustar typing e tratar loading/errors.

---

## Boas práticas e troubleshooting

- SafeArea duplicado: se você notar espaço extra no topo, confirme se a tela NÃO passa `edges` incluindo `top` quando usa o `Header`. Padrão adotado: `Header` consome `top`, telas usam `edges={["left","right","bottom"]}`.
- Problemas de assets: reinicie bundler com `npx expo start -c`.
- Errors TS: rode `npm run typecheck` e corrija imports com caminhos incorretos ou tipagem errada.
- AsyncStorage não disponível em ambiente web/preview: `authContext` tem fallback em memória — comportamento esperado.

---

## Checklist de PR / testes

- [ ] Rodar `npm run typecheck` localmente e garantir sem erros.
- [ ] Rodar `npm run lint` e corrigir avisos relevantes.
- [ ] Testar fluxo de login/register/logout com credenciais do `mockData`.
- [ ] Testar navegação entre telas e validar que `Header` não duplica safe area.

---

## Próximos passos recomendados

1. Implementar `lib/api.ts` e trocar uso de `mockData` por chamadas reais.
2. Adicionar testes unitários (Jest + @testing-library/react-native) para `lib/utils` e componentes principais (`TicketCard`, `Header`).
3. Adicionar CI (GitHub Actions) que execute `npm ci`, `npm run typecheck` e `npm run lint` em PRs.
4. Implementar dark mode via tokens alternativos e `ThemeProvider`.

---

## Contatos / Referências

- Arquivos principais: `app.tsx`, `lib/*`, `components/*`, `screens/*`.
- Para dúvidas sobre publicação Expo (Android/iOS), siga a documentação oficial: https://docs.expo.dev/

---

