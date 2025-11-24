// Status do ticket
export type TicketStatus = 'open' | 'in_progress' | 'closed';

// Nível de criticidade
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// Categoria de ticket
export type TicketCategory = 'bug' | 'feature_request' | 'support' | 'urgent' | 'other';

// Usuário
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    department?: string;
}

// Ticket
export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    severity: SeverityLevel;
    category: TicketCategory;
    requester: User;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    assignedTo?: User;
}

// Estatísticas do dashboard
export interface DashboardStats {
    openCount: number;
    inProgressCount: number;
    closedCount: number;
}

// Props de navegação - ATUALIZADO
export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    Tickets: { status: TicketStatus };
    TicketDetail: { ticketId: string };
    Profile: undefined;
    UserGuide: undefined;
};

// Contexto de Autenticação
export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isSignedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string, department: string) => Promise<void>;
}

// Session/Token
export interface AuthSession {
    user: User;
    token: string;
    expiresAt: number;
}