import React, { useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { mockTickets } from '../lib/mockData';
import { TicketCard } from '../components/TicketCard';
import { getStatusLabel, getStatusColor } from '../lib/utils';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import Header from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'Tickets'>;

export default function TicketsScreen({ navigation, route }: Props) {
    const { status } = route.params;

    // Filtrar tickets por status
    const filteredTickets = useMemo(
        () => mockTickets.filter((ticket) => ticket.status === status),
        [status],
    );

    const statusColor = getStatusColor(status);

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                {/* Header */}
                <View style={{ backgroundColor: colors.surface }}>
                    {/* use shared Header component for safe-area support and consistent layout */}
                    <Header
                        title={getStatusLabel(status)}
                        subtitle={`${filteredTickets.length} ${filteredTickets.length === 1 ? 'ticket' : 'tickets'}`}
                        showBack
                        onBack={() => navigation.goBack()}
                        bottomBorderColor={statusColor}
                    />
                </View>

                {/* Lista de tickets */}
                {filteredTickets.length > 0 ? (
                    <FlatList
                        data={filteredTickets}
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
                            Todos os seus tickets estão em outros status
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 2,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceVariant,
        marginRight: spacing.md,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        ...typography.headingMd,
        color: colors.onSurface,
    },
    subtitle: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginTop: spacing.xs,
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