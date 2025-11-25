import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList, User } from '../types'; 
import { TicketCard } from '../components/TicketCard';
import { getStatusLabel, getStatusColor } from '../lib/utils';
import { colors, spacing, typography } from '../lib/theme';
import Header from '../components/Header';
import api from '../lib/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Tickets'>;

// Interface atualizada para incluir 'assignedTo'
interface Ticket {
    id: string;
    title: string;
    status: 'open' | 'in_progress' | 'closed';
    date: string;
    description: string; 
    severity: 'high' | 'medium' | 'low';
    category: any; 
    requester: User; 
    // CAMPO OBRIGATÓRIO PARA O NOVO CARD
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
}

export default function TicketsScreen({ navigation, route }: Props) {
    const { status } = route.params;
    
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const statusColor = getStatusColor(status);

    const traduzirStatus = (statusBanco: string): 'open' | 'in_progress' | 'closed' => {
        const s = statusBanco ? statusBanco.toLowerCase() : '';
        if (s.includes('aberto')) return 'open';
        if (s.includes('andamento')) return 'in_progress';
        if (s.includes('fechado')) return 'closed';
        return 'open';
    };

    const traduzirPrioridade = (prio: string): 'high' | 'medium' | 'low' => {
        const p = prio ? prio.toUpperCase() : 'M';
        if (p === 'A') return 'high';
        if (p === 'B') return 'low';
        return 'medium';
    };

    const fetchTickets = async () => {
        try {
            const response = await api.get('/tickets/meus?pageSize=100');
            const listaDoBanco = response.data.chamados || [];

            const ticketsFormatados: Ticket[] = listaDoBanco.map((t: any) => ({
                id: t.id_Cham.toString(),
                title: t.titulo_Cham,
                status: traduzirStatus(t.status_Cham),
                date: t.dataAbertura_Cham,
                description: t.descricao_Cham || 'Sem descrição', 
                severity: traduzirPrioridade(t.prioridade_Cham),
                category: t.categoria_Cham || 'Geral',
                
                requester: {
                    id: '0', 
                    name: `${t.nome_User || ''} ${t.sobrenome_User || ''}`.trim() || 'Usuário',
                    email: '',
                    department: ''
                },

                // AQUI ESTÁ O SEGREDO: Pegamos o nome do técnico do banco
                assignedTo: t.tecNome 
                    ? `${t.tecNome} ${t.tecSobrenome || ''}`.trim() 
                    : 'Pendente',
                
                createdAt: t.dataAbertura_Cham,
                updatedAt: t.dataAbertura_Cham
            }));

            const ticketsFiltrados = ticketsFormatados.filter(t => t.status === status);
            
            setTickets(ticketsFiltrados);
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [status]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTickets();
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <View style={{ backgroundColor: colors.surface }}>
                    <Header
                        title={getStatusLabel(status)}
                        subtitle={`${tickets.length} ${tickets.length === 1 ? 'ticket' : 'tickets'}`}
                        showBack
                        onBack={() => navigation.goBack()}
                        bottomBorderColor={statusColor}
                    />
                </View>

                {loading && !refreshing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={{ marginTop: 10, color: colors.onSurfaceVariant }}>Carregando chamados...</Text>
                    </View>
                ) : tickets.length > 0 ? (
                    <FlatList
                        data={tickets}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TicketCard
                                ticket={item}
                                onPress={() =>
                                    navigation.navigate('TicketDetail', { ticketId: item.id })
                                }
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons
                            name="inbox"
                            size={64}
                            color={colors.onSurfaceVariant}
                        />
                        <Text style={styles.emptyText}>Nenhum ticket encontrado</Text>
                        <Text style={styles.emptySubtext}>
                            Você não tem chamados com este status no momento.
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    emptyText: {
        ...typography.headingSm,
        color: colors.onSurface,
        marginTop: spacing.lg,
    },
    emptySubtext: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        marginTop: spacing.md,
        textAlign: 'center',
    },
});