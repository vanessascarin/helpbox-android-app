import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { StatCard } from '../components/StatCard';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { useAuth } from '../lib/authContext';
import Header from '../components/Header';
import api from '../lib/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

// Tipagem interna para o app (compatível com o componente StatCard)
interface Ticket {
    id: string;
    title: string;
    status: 'open' | 'in_progress' | 'closed';
    date: string;
}

export default function DashboardScreen({ navigation }: Props) {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Função para traduzir status do SQL ('Aberto', 'Em andamento') para o App ('open', 'in_progress')
    const traduzirStatus = (statusBanco: string): 'open' | 'in_progress' | 'closed' => {
        const s = statusBanco ? statusBanco.toLowerCase() : '';
        if (s.includes('aberto')) return 'open';
        if (s.includes('andamento')) return 'in_progress';
        if (s.includes('fechado')) return 'closed';
        return 'open'; // Padrão se não reconhecer
    };

    const fetchTickets = async () => {
        try {
            // Chama a rota '/tickets/meus' (que criamos com o seu código web)
            // Passamos pageSize alto para pegar todos os chamados relevantes para a contagem
            const response = await api.get('/tickets/meus?pageSize=100');
            
            // A API Web retorna: { chamados: [...], totalCount: 10, ... }
            const listaDoBanco = response.data.chamados || [];

            // Mapeamos os campos do SQL (titulo_Cham) para o Frontend (title)
            const ticketsFormatados: Ticket[] = listaDoBanco.map((t: any) => ({
                id: t.id_Cham.toString(),
                title: t.titulo_Cham,
                status: traduzirStatus(t.status_Cham),
                date: t.dataAbertura_Cham
            }));

            setTickets(ticketsFormatados);
        } catch (error) {
            console.error('Erro ao buscar tickets:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTickets();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTickets();
    };

    const openCount = tickets.filter((t) => t.status === 'open').length;
    const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
    const closedCount = tickets.filter((t) => t.status === 'closed').length;

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <Header
                    title="HelpBox"
                    right={(
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                            <TouchableOpacity onPress={() => navigation.navigate('UserGuide')} style={styles.iconButton}>
                                <MaterialIcons name="help-outline" size={24} color={colors.onSurface} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
                                <MaterialIcons name="account-circle" size={32} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                    )}
                />

                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>
                        Olá, <Text style={styles.userName}>{user?.name}</Text>!
                    </Text>
                </View>

                {loading && !refreshing ? (
                    <View style={{ padding: 20 }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <Text style={styles.sectionTitle}>Seus Tickets</Text>

                        <StatCard
                            label="Abertos"
                            count={openCount}
                            color={colors.error}
                            icon="new-releases"
                            onPress={() => navigation.navigate('Tickets', { status: 'open' })}
                        />
                        <StatCard
                            label="Em Andamento"
                            count={inProgressCount}
                            color={colors.warning}
                            icon="schedule"
                            onPress={() => navigation.navigate('Tickets', { status: 'in_progress' })}
                        />
                        <StatCard
                            label="Concluídos"
                            count={closedCount}
                            color={colors.success}
                            icon="check-circle"
                            onPress={() => navigation.navigate('Tickets', { status: 'closed' })}
                        />
                        
                        {/* ... Dicas e outras seções ... */}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background },
    iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.surfaceVariant },
    profileButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant },
    welcomeSection: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, backgroundColor: '#393C5D' },
    welcomeText: { ...typography.bodyLg, color: colors.onPrimary },
    userName: { fontWeight: '600' },
    scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl, flexGrow: 1 },
    sectionTitle: { ...typography.headingMd, color: colors.onSurface, marginBottom: spacing.md },
});