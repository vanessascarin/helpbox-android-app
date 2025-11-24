import { Ticket, User } from '../types';

const currentUser: User = {
  id: 'user_001',
  name: 'João Silva',
  email: 'joao.silva@company.com',
  department: 'Suporte Técnico',
};

const mockUsers: User[] = [
  currentUser,
  {
    id: 'user_002',
    name: 'Maria Santos',
    email: 'maria.santos@company.com',
    department: 'Desenvolvimento',
  },
  {
    id: 'user_003',
    name: 'Pedro Costa',
    email: 'pedro.costa@company.com',
    department: 'Infraestrutura',
  },
  {
    id: 'user_004',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@company.com',
    department: 'Suporte Técnico',
  },
];

const mockTickets: Ticket[] = [
  {
    id: 'TKT001',
    title: 'Sistema não abre no navegador Chrome',
    description:
      'O sistema está retornando erro 500 quando tento acessar pelo Chrome. Já tentei limpar cache e cookies mas o problema persiste. Urge resolução pois prejudica meu trabalho.',
    status: 'open',
    severity: 'high',
    category: 'bug',
    requester: mockUsers[1],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'TKT002',
    title: 'Relatório mensal não gera PDF',
    description:
      'Quando clico em "Gerar PDF" no menu de relatórios, a aplicação congela. Testei com vários navegadores e o problema persiste.',
    status: 'open',
    severity: 'critical',
    category: 'bug',
    requester: mockUsers[2],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'TKT003',
    title: 'Solicitar integração com sistema ERP',
    description:
      'Precisamos integrar o sistema HelpBox com nosso ERP para automatizar a criação de tickets. Temos API disponível.',
    status: 'open',
    severity: 'medium',
    category: 'feature_request',
    requester: mockUsers[3],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'TKT004',
    title: 'Otimizar tempo de carregamento da dashboard',
    description:
      'A página inicial está levando mais de 5 segundos para carregar em conexões 4G. Há muitas requisições simultâneas.',
    status: 'in_progress',
    severity: 'medium',
    category: 'support',
    requester: mockUsers[1],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    assignedTo: mockUsers[2],
  },
  {
    id: 'TKT005',
    title: 'Adicionar suporte a temas escuros',
    description:
      'Implementar theme dark mode em toda a aplicação para melhorar experiência do usuário em ambientes com pouca luz.',
    status: 'in_progress',
    severity: 'low',
    category: 'feature_request',
    requester: mockUsers[2],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    assignedTo: mockUsers[0],
  },
  {
    id: 'TKT006',
    title: 'Credencial de acesso renovada com sucesso',
    description: 'Sua senha foi resetada conforme solicitado. Acesse agora com as novas credenciais.',
    status: 'closed',
    severity: 'low',
    category: 'support',
    requester: mockUsers[3],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    assignedTo: mockUsers[0],
  },
  {
    id: 'TKT007',
    title: 'Backup automático implementado',
    description: 'Configuramos backups automáticos diários para seu ambiente. Testes realizados com sucesso.',
    status: 'closed',
    severity: 'medium',
    category: 'support',
    requester: mockUsers[2],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    assignedTo: mockUsers[3],
  },
  {
    id: 'TKT008',
    title: 'Erro 404 na página de downloads',
    description: 'Link de download no portal de recursos retorna página não encontrada.',
    status: 'closed',
    severity: 'medium',
    category: 'bug',
    requester: mockUsers[1],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    assignedTo: mockUsers[0],
  },
];

// Credenciais de teste para login
export const mockCredentials = [
  {
    email: 'joao.silva@company.com',
    password: 'senha123',
    user: mockUsers[0],
  },
  {
    email: 'maria.santos@company.com',
    password: 'senha123',
    user: mockUsers[1],
  },
  {
    email: 'pedro.costa@company.com',
    password: 'senha123',
    user: mockUsers[2],
  },
  {
    email: 'ana.oliveira@company.com',
    password: 'senha123',
    user: mockUsers[3],
  },
  {
    email: 'demo@example.com',
    password: 'demo123',
    user: {
      id: 'user_demo',
      name: 'Usuário Demo',
      email: 'demo@example.com',
      department: 'TI',
    },
  },
];

export { mockTickets, mockUsers, currentUser };