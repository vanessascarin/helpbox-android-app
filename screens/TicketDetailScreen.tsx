import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { mockTickets } from '../lib/mockData';
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

type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetail'>;

export default function TicketDetailScreen({ navigation, route }: Props) {
    const { ticketId } = route.params;

    const ticket = useMemo(
        () => mockTickets.find((t) => t.id === ticketId),
        [ticketId],
    );

    if (!ticket) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.errorText}>Ticket não encontrado</Text>
                </View>
            </SafeAreaView>
        );
    }

    const statusColor = getStatusColor(ticket.status);
    const severityColor = getSeverityColor(ticket.severity);

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <Header title={ticket.id} showBack onBack={() => navigation.goBack()} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Título e Status */}
                    <View style={styles.section}>
                        <Text style={styles.title}>{ticket.title}</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                                <Text style={styles.badgeText}>
                                    {getStatusLabel(ticket.status)}
                                </Text>
                            </View>
                            <View
                                style={[styles.severityBadge, { backgroundColor: severityColor }]}
                            >
                                <Text style={styles.badgeText}>
                                    {getSeverityLabel(ticket.severity)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Informações principais */}
                    <View style={styles.section}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>ID do Ticket:</Text>
                            <Text style={styles.value}>{ticket.id}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Categoria:</Text>
                            <Text style={styles.value}>
                                {getCategoryLabel(ticket.category)}
                            </Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Data de Abertura:</Text>
                            <Text style={styles.value}>{formatDate(ticket.createdAt)}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Última Atualização:</Text>
                            <Text style={styles.value}>{formatDate(ticket.updatedAt)}</Text>
                        </View>
                    </View>

                    {/* Requester */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quem Abriu</Text>
                        <View style={styles.requesterCard}>
                            <MaterialIcons
                                name="person"
                                size={32}
                                color={colors.primary}
                                style={{ marginRight: spacing.md }}
                            />
                            <View>
                                <Text style={styles.requesterName}>
                                    {ticket.requester.name}
                                </Text>
                                <Text style={styles.requesterEmail}>
                                    {ticket.requester.email}
                                </Text>
                                {ticket.requester.department && (
                                    <Text style={styles.requesterDept}>
                                        {ticket.requester.department}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Descrição */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Descrição</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.description}>{ticket.description}</Text>
                        </View>
                    </View>

                    {/* Atribuído a (se aplicável) */}
                    {ticket.assignedTo && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Atribuído a</Text>
                            <View style={styles.requesterCard}>
                                <MaterialIcons
                                    name="assignment-ind"
                                    size={32}
                                    color={colors.success}
                                    style={{ marginRight: spacing.md }}
                                />
                                <View>
                                    <Text style={styles.requesterName}>
                                        {ticket.assignedTo.name}
                                    </Text>
                                    <Text style={styles.requesterEmail}>
                                        {ticket.assignedTo.email}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceVariant,
    },
    headerTitle: {
        ...typography.headingMd,
        color: colors.onSurface,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.headingMd,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    statusRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statusBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
    },
    severityBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        ...typography.labelMd,
        color: colors.onPrimary,
    },
    sectionTitle: {
        ...typography.headingSm,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
    },
    label: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        flex: 1,
    },
    value: {
        ...typography.bodyMd,
        color: colors.onSurface,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: colors.outlineVariant,
    },
    requesterCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        alignItems: 'center',
    },
    requesterName: {
        ...typography.headingSm,
        color: colors.onSurface,
    },
    requesterEmail: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginTop: spacing.xs,
    },
    requesterDept: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },
    descriptionCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },
    description: {
        ...typography.bodyMd,
        color: colors.onSurface,
        lineHeight: 24,
    },
    errorText: {
        ...typography.bodyMd,
        color: colors.error,
        textAlign: 'center',
    },
});