import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ticket } from '../types';
import {
    getStatusLabel,
    getStatusColor,
    getSeverityLabel,
    getSeverityColor,
    formatRelativeDate,
    getCategoryLabel,
} from '../lib/utils';
import { colors, spacing, borderRadius, typography } from '../lib/theme';

interface TicketCardProps {
    ticket: Ticket;
    onPress: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress }) => {
    const statusColor = getStatusColor(ticket.status);
    const severityColor = getSeverityColor(ticket.severity);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <Text style={styles.id}>#{ticket.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>
                        {getStatusLabel(ticket.status)}
                    </Text>
                </View>
            </View>

            <Text style={styles.title} numberOfLines={2}>
                {ticket.title}
            </Text>

            <Text style={styles.requester}>
                Solicitante: {ticket.requester.name}
            </Text>

            <View style={styles.footer}>
                <View style={styles.categoryContainer}>
                    <Text style={styles.category}>
                        {getCategoryLabel(ticket.category)}
                    </Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                    <Text style={styles.severityText}>
                        {getSeverityLabel(ticket.severity)}
                    </Text>
                </View>
                <Text style={styles.date}>{formatRelativeDate(ticket.createdAt)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        shadowColor: colors.scrim,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    id: {
        ...typography.labelMd,
        color: colors.onSurfaceVariant,
    },
    statusBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    statusText: {
        ...typography.labelMd,
        color: colors.onPrimary,
    },
    title: {
        ...typography.headingSm,
        color: colors.onSurface,
        marginBottom: spacing.sm,
    },
    requester: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.md,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryContainer: {
        backgroundColor: colors.surfaceVariant,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        flex: 1,
    },
    category: {
        ...typography.labelMd,
        color: colors.onSurfaceVariant,
    },
    severityBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginLeft: spacing.sm,
        marginRight: spacing.sm,
    },
    severityText: {
        ...typography.labelMd,
        color: colors.onPrimary,
    },
    date: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
    },
});