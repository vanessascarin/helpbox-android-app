# 📦 HelpBox Mobile

Bem-vindo ao repositório do HelpBox Mobile, uma aplicação desenvolvida em React Native (Expo) com Backend em Node.js (Express) e banco de dados SQL Server (Azure).

Este aplicativo permite que colaboradores da Esfera Contabilidade consultem seus chamados de suporte, vejam sugestões geradas por IA e acompanhem as soluções técnicas em tempo real.

## 🚀 Tecnologias Utilizadas

Mobile (Frontend)

React Native (Expo SDK 50+)

TypeScript (Tipagem estática e segurança)

React Navigation (Navegação entre telas)

Axios (Comunicação com a API)

AsyncStorage (Persistência de sessão local)

Backend (API)

Node.js & Express

mssql (Driver oficial para SQL Server)

bcrypt (Criptografia de senhas)

express-session (Gerenciamento de sessões)

Banco de Dados

Azure SQL Database (Nuvem)

Tabelas principais: Usuario, Chamado, Tecnico

## ⚙️ Como Rodar o Projeto (Ambiente de Desenvolvimento)

Para rodar este projeto, você precisará de dois terminais abertos simultaneamente: um para o Backend e outro para o Expo.

Pré-requisitos

Node.js instalado.

Conta na Expo (para gerar builds).

Acesso à internet (para conectar ao Azure).

### 1️⃣ Passo 1: Configurar e Rodar o Backend

O backend precisa estar rodando para o app conectar.

#### Abra um terminal e entre na pasta backend
cd backend

#### Instale as dependências (caso seja a primeira vez)
npm install

#### Inicie o servidor
node server.js


Se tudo der certo, você verá: ☁️ Conectado ao Azure SQL Database (Helpbox) com Sucesso!

### 2️⃣ Passo 2: Rodar o Aplicativo Mobile

Em um segundo terminal (na raiz do projeto):

#### Instale as dependências do app
npm install --legacy-peer-deps

#### Descubra seu IP local (Windows)
ipconfig 
#### Copie o endereço IPv4 (ex: 192.168.15.10)

#### Atualize o arquivo src/lib/api.ts com esse IP!
const API_URL = 'http://SEU_IP_AQUI:3000';

#### Inicie o Expo
npx expo start -c


Escaneie o QR Code com o app Expo Go (Android/iOS) ou use um emulador.

## 📱 Funcionalidades Principais

### 1. Login Seguro

Autenticação via banco de dados Azure.

Senhas criptografadas com Hash.

Bloqueio de cadastro direto (apenas gestores criam contas).

### 2. Dashboard Inteligente

Visão geral dos chamados (Abertos, Em Andamento, Concluídos).

Contadores atualizados em tempo real.

"Pull to Refresh" para atualizar dados.

### 3. Detalhes do Chamado

Visualização completa do ticket.

Sugestão de IA: Exibição formatada com Markdown.

Solução Técnica: Campo dedicado para resposta do suporte.

Status Visual: Cores e ícones dinâmicos conforme a prioridade e estado.


## 🛠️ Solução de Problemas Comuns

Erro "Network Error" no Login:

Verifique se o IP no lib/api.ts está correto.

Verifique se o Firewall do Windows permitiu a porta 3000.

Garanta que o celular e o PC estão no mesmo Wi-Fi.

Erro de Conexão com Banco (Azure):

Seu IP pode ter mudado. Acesse o Portal do Azure > SQL Database > Firewalls e adicione seu IP atual.

Desenvolvido por Vanessa Scarin 🚀
