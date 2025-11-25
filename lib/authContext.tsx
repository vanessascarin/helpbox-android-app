import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, AuthSession } from '../types';
import api from './api'; 

let AsyncStorage: any = null;
try {
    AsyncStorage = require('@react-native-async-storage/async-storage');
} catch (e) {
    console.warn('AsyncStorage não detectado. Usando memória temporária.');
}

const memoryStorage: Record<string, string> = {};

const storageGet = async (key: string) => {
    if (AsyncStorage && AsyncStorage.getItem) return AsyncStorage.getItem(key);
    return memoryStorage[key] ?? null;
};

const storageSet = async (key: string, value: string) => {
    if (AsyncStorage && AsyncStorage.setItem) return AsyncStorage.setItem(key, value);
    memoryStorage[key] = value;
    return;
};

const storageRemove = async (key: string) => {
    if (AsyncStorage && AsyncStorage.removeItem) return AsyncStorage.removeItem(key);
    delete memoryStorage[key];
    return;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        bootstrapAsync();
    }, []);

    const bootstrapAsync = async () => {
        try {
            const session = await storageGet('authSession');
            if (session) {
                const parsedSession: AuthSession = JSON.parse(session);
                if (parsedSession.expiresAt > Date.now()) {
                    setUser(parsedSession.user);
                    setIsSignedIn(true);
                } else {
                    await storageRemove('authSession');
                }
            }
        } catch (e) {
            console.error('Erro ao restaurar sessão:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<void> => {
        setIsLoading(true);
        try {
            console.log('Iniciando login via API...');
            
            const response = await api.post('/auth/login', {
                email: email,
                senha: password 
            });

            console.log('Resposta do servidor:', response.data);

            const dadosDoBanco = response.data.usuario;

            if (!dadosDoBanco) {
                throw new Error('O servidor não retornou os dados do usuário.');
            }

            const nomeCompleto = `${dadosDoBanco.nome || ''} ${dadosDoBanco.sobrenome || ''}`.trim();

            const usuarioFormatado: User = {
                id: (dadosDoBanco.id || dadosDoBanco.id_User)?.toString() || '0',
                name: nomeCompleto || 'Usuário',
                email: dadosDoBanco.email || email,
                department: dadosDoBanco.departamento || 'Geral',
                // NOVO: Captura o nível de acesso (se não vier, assume 1)
                // Nota: Você pode precisar adicionar 'level?: number' no seu arquivo types/index.ts
                level: dadosDoBanco.nivel_acesso ?? 1 
            } as User;

            const session: AuthSession = {
                user: usuarioFormatado,
                token: 'dummy_token',
                expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
            };

            await storageSet('authSession', JSON.stringify(session));
            setUser(usuarioFormatado);
            setIsSignedIn(true);

        } catch (error: any) {
            console.error('Erro detalhado do Login:', error);
            let mensagemErro = 'Erro ao conectar ao servidor.';
            if (error.response) {
                mensagemErro = error.response.data.error || 'Credenciais inválidas.';
            } else if (error.request) {
                mensagemErro = 'O servidor não respondeu. Verifique o IP no api.ts.';
            } else {
                mensagemErro = error.message;
            }
            throw new Error(mensagemErro);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, department: string): Promise<void> => {
        setIsLoading(true);
        try {
            console.warn('Rota de registro não implementada ainda.');
            throw new Error('O registro de novos usuários deve ser feito pelo painel administrativo.');
        } catch (error: any) {
            throw new Error(error.message || 'Erro ao registrar');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await storageRemove('authSession');
            setUser(null);
            setIsSignedIn(false);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isSignedIn,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};