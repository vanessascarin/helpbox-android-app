import { SeverityLevel, TicketStatus } from '../types';
import { colors } from './theme';

// Formatar data de forma legível
export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Formatar data relativa (ex: "há 2 dias")
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'agora';
  if (minutes < 60) return `há ${minutes}m`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 30) return `há ${days}d`;

  return formatDate(date);
};

// Obter label do status
export const getStatusLabel = (status: TicketStatus): string => {
  const labels: Record<TicketStatus, string> = {
    open: 'Aberto',
    in_progress: 'Em Andamento',
    closed: 'Fechado',
  };
  return labels[status];
};

// Obter cor do status
export const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case 'open':
      return colors.error;
    case 'in_progress':
      return colors.warning;
    case 'closed':
      return colors.success;
    default:
      return colors.outline;
  }
};

// Obter label de criticidade
export const getSeverityLabel = (severity: SeverityLevel): string => {
  const labels: Record<SeverityLevel, string> = {
    critical: 'Crítico',
    high: 'Alto',
    medium: 'Médio',
    low: 'Baixo',
  };
  return labels[severity];
};

// Obter cor de criticidade
export const getSeverityColor = (severity: SeverityLevel): string => {
  switch (severity) {
    case 'critical':
      return colors.critical;
    case 'high':
      return colors.high;
    case 'medium':
      return colors.medium;
    case 'low':
      return colors.low;
    default:
      return colors.outline;
  }
};

// Obter label da categoria
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    bug: 'Bug',
    feature_request: 'Solicitação',
    support: 'Suporte',
    urgent: 'Urgente',
    other: 'Outro',
  };
  return labels[category] || category;
};

// Agrupar tickets por status
export const groupTicketsByStatus = (tickets: any[]) => {
  return {
    open: tickets.filter((t) => t.status === 'open'),
    in_progress: tickets.filter((t) => t.status === 'in_progress'),
    closed: tickets.filter((t) => t.status === 'closed'),
  };
};

// Validar email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar senha (mínimo 6 caracteres)
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Validar campos obrigatórios
export const validateLoginForm = (email: string, password: string): { valid: boolean; error?: string } => {
  if (!email.trim()) {
    return { valid: false, error: 'Email é obrigatório' };
  }
  if (!password.trim()) {
    return { valid: false, error: 'Senha é obrigatória' };
  }
  if (!validateEmail(email)) {
    return { valid: false, error: 'Email inválido' };
  }
  if (!validatePassword(password)) {
    return { valid: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }
  return { valid: true };
};

// Validar formulário de registro
export const validateRegisterForm = (name: string, email: string, password: string, department: string): { valid: boolean; error?: string } => {
  if (!name.trim()) {
    return { valid: false, error: 'Nome é obrigatório' };
  }
  if (!email.trim()) {
    return { valid: false, error: 'Email é obrigatório' };
  }
  if (!password.trim()) {
    return { valid: false, error: 'Senha é obrigatória' };
  }
  if (!department.trim()) {
    return { valid: false, error: 'Departamento é obrigatório' };
  }
  if (!validateEmail(email)) {
    return { valid: false, error: 'Email inválido' };
  }
  if (!validatePassword(password)) {
    return { valid: false, error: 'Senha deve ter no mínimo 6 caracteres' };
  }
  return { valid: true };
};