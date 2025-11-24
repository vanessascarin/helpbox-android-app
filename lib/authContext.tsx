import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User, AuthSession } from '../types';
import api from './api'; // Importa a conexão configurada com seu IP

// Importação segura do AsyncStorage (evita erro na web/preview se não estiver instalado)
let AsyncStorage: any = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AsyncStorage = require('@react-native-async-storage/async-storage');
} catch (e) {
    console.warn('AsyncStorage não detectado. Usando memória temporária.');
}

// --- Helpers para Armazenamento (Funciona no Celular e na Web) ---
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

// --- Contexto ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);

    // Ao abrir o App, verifica se já tem usuário salvo
    useEffect(() => {
        bootstrapAsync();
    }, []);

    const bootstrapAsync = async () => {
        try {
            const session = await storageGet('authSession');
            if (session) {
                const parsedSession: AuthSession = JSON.parse(session);
                
                // Verifica se a sessão ainda é válida (data de expiração)
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
            
            // 1. Chamada ao Backend
            // Enviamos "senha" porque é isso que seu Node.js espera no req.body
            const response = await api.post('/auth/login', {
                email: email,
                senha: password 
            });

            console.log('Resposta do servidor:', response.data);

            // 2. Pegamos o objeto de usuário que adicionamos no backend
            const dadosDoBanco = response.data.usuario;

            if (!dadosDoBanco) {
                throw new Error('O servidor não retornou os dados do usuário. Verifique se o backend foi atualizado.');
            }

            // 3. Mapeamento de Campos (SQL -> App)
            // O Banco devolve: id_User, nome_User, departamento_User
            // O App espera: id, name, department (conforme seu User type)
            const usuarioFormatado: User = {
                id: dadosDoBanco.id_User?.toString() || '0',
                name: dadosDoBanco.nome_User || 'Usuário',
                email: dadosDoBanco.email_User || email,
                department: dadosDoBanco.departamento_User || 'Geral',
                // Adicione aqui outros campos se o seu type User exigir
            };

            // 4. Cria a Sessão Local
            const session: AuthSession = {
                user: usuarioFormatado,
                token: 'dummy_token', // Token simbólico pois a auth é via cookie/sessão
                expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expira em 7 dias
            };

            // 5. Salva no celular e atualiza estado
            await storageSet('authSession', JSON.stringify(session));
            setUser(usuarioFormatado);
            setIsSignedIn(true);

        } catch (error: any) {
            console.error('Erro detalhado do Login:', error);
            
            let mensagemErro = 'Erro ao conectar ao servidor.';

            if (error.response) {
                // O servidor respondeu (ex: 401 Senha incorreta)
                mensagemErro = error.response.data.error || 'Credenciais inválidas.';
            } else if (error.request) {
                // O servidor não respondeu (Erro de IP ou Rede)
                mensagemErro = 'O servidor não respondeu. Verifique o IP no lib/api.ts';
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
            // Espaço reservado para futura implementação da rota de registro
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
            // Remove a sessão do armazenamento local
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