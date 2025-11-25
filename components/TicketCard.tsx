import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { 
    getStatusLabel, 
    getStatusColor, 
    getSeverityLabel, 
    getSeverityColor,
    formatRelativeDate, // Usei formatRelativeDate do seu código original (mais bonito na lista)
    getCategoryLabel
} from '../lib/utils';
import { colors, spacing, borderRadius, typography } from '../lib/theme';

// Usamos 'any' no ticket para ser flexível com as tipagens parciais, 
// mas garantimos que usamos os campos certos no render.
interface TicketCardProps {
    ticket: any; 
    onPress: () => void;
}

export const TicketCard = ({ ticket, onPress }: TicketCardProps) => {
    const statusColor = getStatusColor(ticket.status);
    const severityColor = getSeverityColor(ticket.severity);
    
    // Se tiver técnico atribuído, mostra o nome. Se não, mostra "Pendente"
    const assigneeName = ticket.assignedTo || 'Pendente';

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Linha Superior: ID e Badge de Status */}
            <View style={styles.headerRow}>
                <Text style={styles.idText}>#{ticket.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>
                        {getStatusLabel(ticket.status)}
                    </Text>
                </View>
            </View>

            {/* Título do Chamado */}
            <Text style={styles.title} numberOfLines={2}>
                {ticket.title}
            </Text>

            {/* Nova Linha: Atribuído a (Substituindo Solicitante) */}
            <View style={styles.assigneeContainer}>
                <Text style={styles.assigneeLabel}>Atribuído a:</Text>
                <Text style={styles.assigneeValue} numberOfLines={1}>
                    {assigneeName}
                </Text>
            </View>

            {/* Rodapé: Categoria, Prioridade e Data */}
            <View style={styles.footerRow}>
                {/* Categoria (Pílula Cinza - Agora mostra a Categoria real) */}
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                        {getCategoryLabel(ticket.category)}
                    </Text>
                </View>

                {/* Prioridade (Pílula Colorida) */}
                <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                    <Text style={styles.severityText}>
                        {getSeverityLabel(ticket.severity)}
                    </Text>
                </View>

                {/* Data (Usando formatRelativeDate para "há 1 dia") */}
                <Text style={styles.dateText}>
                    {formatRelativeDate(ticket.createdAt || ticket.date)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        // Sombra suave estilo card
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    idText: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        fontWeight: 'bold',
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    statusText: {
        ...typography.labelSm,
        color: colors.onPrimary,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        ...typography.headingSm,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    assigneeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    assigneeLabel: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginRight: spacing.xs,
    },
    assigneeValue: {
        ...typography.bodySm,
        color: colors.onSurface,
        fontWeight: '600',
        flex: 1,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: spacing.sm, // Espaçamento entre os itens
    },
    categoryBadge: {
        backgroundColor: colors.surfaceVariant, // Cinza
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    categoryText: {
        ...typography.labelSm,
        color: colors.onSurfaceVariant,
        fontWeight: '600',
    },
    severityBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    severityText: {
        ...typography.labelSm,
        color: colors.onPrimary,
        fontWeight: '600',
    },
    dateText: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginLeft: 'auto', // Empurra a data para a direita
    },
});