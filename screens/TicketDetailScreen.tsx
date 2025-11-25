import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
// 1. IMPORTAÇÃO NOVA: O renderizador de Markdown
import Markdown from 'react-native-markdown-display';

import { RootStackParamList } from '../types';
import {
    getStatusLabel,
    getStatusColor,
    getSeverityLabel,
    getSeverityColor,
    formatDate,
    getCategoryLabel,
} from '../lib/utils';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import Header from '../components/Header';
import api from '../lib/api';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetail'>;

interface TicketDetail {
    id: string;
    title: string;
    status: 'open' | 'in_progress' | 'closed';
    severity: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    requester: {
        name: string;
    };
    assignedTo?: {
        name: string;
    };
    aiSolution?: string;
    techSolution?: string;
    finalSolution?: string;
}

export default function TicketDetailScreen({ navigation, route }: Props) {
    const { ticketId } = route.params;
    
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const fetchTicketDetails = async () => {
        try {
            const response = await api.get(`/tickets/${ticketId}`);
            const dados = response.data;

            const detalheFormatado: TicketDetail = {
                id: dados.id_Cham.toString(),
                title: dados.titulo_Cham,
                status: traduzirStatus(dados.status_Cham),
                severity: traduzirPrioridade(dados.prioridade_Cham),
                category: dados.categoria_Cham || 'Geral',
                description: dados.descricao_Cham,
                createdAt: dados.dataAbertura_Cham,
                updatedAt: dados.dataFechamento_Cham || dados.dataAbertura_Cham,
                
                requester: {
                    name: `${dados.clienteNome || ''} ${dados.clienteSobrenome || ''}`.trim() || 'Usuário',
                },
                
                assignedTo: dados.tecNome ? {
                    name: `${dados.tecNome} ${dados.tecSobrenome || ''}`.trim(),
                } : undefined,

                aiSolution: dados.solucaoIA_Cham,
                techSolution: dados.solucaoTec_Cham,
                finalSolution: dados.solucaoFinal_Cham
            };

            setTicket(detalheFormatado);
        } catch (err) {
            console.error('Erro ao buscar detalhes:', err);
            setError('Não foi possível carregar os detalhes do chamado.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 10, color: colors.onSurfaceVariant }}>Carregando detalhes...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!ticket || error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Header title="Erro" showBack onBack={() => navigation.goBack()} />
                    <View style={styles.centerContainer}>
                        <MaterialIcons name="error-outline" size={48} color={colors.error} />
                        <Text style={styles.errorText}>{error || 'Ticket não encontrado'}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchTicketDetails}>
                            <Text style={styles.retryText}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    const statusColor = getStatusColor(ticket.status);
    const severityColor = getSeverityColor(ticket.severity);

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <Header title={`#${ticket.id}`} showBack onBack={() => navigation.goBack()} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* --- BLOCO 1: CABEÇALHO (Título, Status, ID) --- */}
                    <View style={styles.section}>
                        <Text style={styles.title}>{ticket.title}</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                                <Text style={styles.badgeText}>
                                    {getStatusLabel(ticket.status)}
                                </Text>
                            </View>
                            <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                                <Text style={styles.badgeText}>
                                    {getSeverityLabel(ticket.severity)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>ID do Ticket:</Text>
                            <Text style={styles.value}>{ticket.id}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Categoria:</Text>
                            <Text style={styles.value}>{getCategoryLabel(ticket.category)}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Data de Abertura:</Text>
                            <Text style={styles.value}>{formatDate(new Date(ticket.createdAt))}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Última Atualização:</Text>
                            <Text style={styles.value}>{formatDate(new Date(ticket.updatedAt))}</Text>
                        </View>
                    </View>

                    {/* --- BLOCO 2: PESSOAS (Solicitante e Técnico) --- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quem Abriu</Text>
                        <View style={styles.requesterCard}>
                            <MaterialIcons name="person" size={32} color={colors.primary} style={{ marginRight: spacing.md }} />
                            <View>
                                <Text style={styles.requesterName}>{ticket.requester.name}</Text>
                            </View>
                        </View>
                    </View>

                    {ticket.assignedTo && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Atribuído a</Text>
                            <View style={styles.requesterCard}>
                                <MaterialIcons name="assignment-ind" size={32} color={colors.success} style={{ marginRight: spacing.md }} />
                                <View>
                                    <Text style={styles.requesterName}>{ticket.assignedTo.name}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* --- BLOCO 3: CONTEÚDO (Descrição e Soluções) --- */}
                    
                    {/* Descrição */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Descrição</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.description}>{ticket.description}</Text>
                        </View>
                    </View>

                    {/* Sugestão IA (Com Markdown!) */}
                    <View style={styles.section}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                            <MaterialIcons name="smart-toy" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Sugestão gerada por IA</Text>
                        </View>
                        <View style={[styles.descriptionCard, { backgroundColor: '#F0F7FF', borderColor: '#CCE5FF' }]}>
                            {ticket.aiSolution ? (
                                // 2. MUDANÇA: Usamos o componente Markdown aqui com estilo personalizado
                                <Markdown style={markdownStyles}>
                                    {ticket.aiSolution}
                                </Markdown>
                            ) : (
                                <Text style={[styles.description, { fontStyle: 'italic', color: colors.onSurfaceVariant }]}>
                                    Nenhuma sugestão gerada.
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* Solução Técnico */}
                    {(ticket.status === 'in_progress' || ticket.status === 'closed') && (
                        <View style={styles.section}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                                <MaterialIcons name="engineering" size={20} color={colors.warning} style={{ marginRight: 8 }} />
                                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Solução Técnico</Text>
                            </View>
                            <View style={[styles.descriptionCard, { backgroundColor: '#FFF9F0', borderColor: '#FFEeba' }]}>
                                <Text style={[styles.description, !ticket.techSolution && { fontStyle: 'italic', color: colors.onSurfaceVariant }]}>
                                    {ticket.techSolution || 'Ainda não preenchido pelo técnico.'}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Solução Final */}
                    {ticket.status === 'closed' && (
                        <View style={styles.section}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                                <MaterialIcons name="check-circle" size={20} color={colors.success} style={{ marginRight: 8 }} />
                                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Solução Final</Text>
                            </View>
                            <View style={[styles.descriptionCard, { backgroundColor: '#F0FFF4', borderColor: '#C3E6CB' }]}>
                                <Text style={[styles.description, !ticket.finalSolution && { fontStyle: 'italic', color: colors.onSurfaceVariant }]}>
                                    {ticket.finalSolution || 'Sem solução final registrada.'}
                                </Text>
                            </View>
                        </View>
                    )}

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

// 3. MUDANÇA: Estilos específicos para o Markdown (para combinar com o seu tema)
const markdownStyles = StyleSheet.create({
    body: {
        ...typography.bodyMd,
        color: colors.onSurface,
        fontSize: 16,
        lineHeight: 24,
    },
    strong: {
        fontWeight: 'bold',
        color: colors.onSurface,
    },
    heading1: {
        ...typography.headingMd,
        marginBottom: 10,
        marginTop: 10,
    },
    paragraph: {
        marginBottom: 10,
        flexWrap: 'wrap', // Importante para não cortar texto
    },
    list_item: {
        marginBottom: 5,
    }
});

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.surfaceVariant },
    headerTitle: { ...typography.headingMd, color: colors.onSurface },
    scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl },
    section: { marginBottom: spacing.xl },
    title: { ...typography.headingMd, color: colors.onSurface, marginBottom: spacing.md },
    statusRow: { flexDirection: 'row', gap: spacing.md },
    statusBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
    severityBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
    badgeText: { ...typography.labelMd, color: colors.onPrimary },
    sectionTitle: { ...typography.headingSm, color: colors.onSurface, marginBottom: spacing.md },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
    label: { ...typography.bodyMd, color: colors.onSurfaceVariant, flex: 1 },
    value: { ...typography.bodyMd, color: colors.onSurface, fontWeight: '600', flex: 1, textAlign: 'right' },
    divider: { height: 1, backgroundColor: colors.outlineVariant },
    requesterCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.outlineVariant, alignItems: 'center' },
    requesterName: { ...typography.headingSm, color: colors.onSurface },
    descriptionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.outlineVariant },
    description: { ...typography.bodyMd, color: colors.onSurface, lineHeight: 24 },
    errorText: { ...typography.bodyMd, color: colors.error, textAlign: 'center', marginBottom: spacing.md },
    retryButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.primary, borderRadius: borderRadius.md },
    retryText: { color: colors.onPrimary, fontWeight: '600' },
});