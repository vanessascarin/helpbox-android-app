import React from 'react';
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
import { StatCard } from '../components/StatCard';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { useAuth } from '../lib/authContext';
import Header from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
    const { user } = useAuth();

    // Contar tickets por status
    const openCount = mockTickets.filter((t) => t.status === 'open').length;
    const inProgressCount = mockTickets.filter(
        (t) => t.status === 'in_progress',
    ).length;
    const closedCount = mockTickets.filter((t) => t.status === 'closed').length;

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <Header
                    title="HelpBox"
                    right={(
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('UserGuide')}
                                style={styles.iconButton}
                            >
                                <MaterialIcons
                                    name="help-outline"
                                    size={24}
                                    color={colors.onSurface}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Profile')}
                                style={styles.profileButton}
                            >
                                <MaterialIcons
                                    name="account-circle"
                                    size={32}
                                    color={colors.primary}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />

                {/* Seção de boas-vindas */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>
                        Bem-vindo, <Text style={styles.userName}>{user?.name}</Text>! Você tem{' '}
                        <Text style={styles.highlightText}>{openCount} chamado aberto</Text>.
                    </Text>
                </View>

                {/* Cards de estatísticas */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    // allow content to grow and push footer appropriately
                    contentInsetAdjustmentBehavior="automatic"
                >
                    <Text style={styles.sectionTitle}>Seus Tickets</Text>

                    <StatCard
                        label="Abertos"
                        count={openCount}
                        color={colors.error}
                        icon="new-releases"
                        onPress={() =>
                            navigation.navigate('Tickets', { status: 'open' })
                        }
                    />

                    <StatCard
                        label="Em Andamento"
                        count={inProgressCount}
                        color={colors.warning}
                        icon="schedule"
                        onPress={() =>
                            navigation.navigate('Tickets', { status: 'in_progress' })
                        }
                    />

                    <StatCard
                        label="Concluídos"
                        count={closedCount}
                        color={colors.success}
                        icon="check-circle"
                        onPress={() =>
                            navigation.navigate('Tickets', { status: 'closed' })
                        }
                    />

                    {/* Seção de informações rápidas */}
                    <View style={styles.infoSection}>
                        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
                            Dicas Rápidas
                        </Text>
                        <View style={styles.infoCard}>
                            <MaterialIcons
                                name="info"
                                size={20}
                                color={colors.info}
                                style={{ marginRight: spacing.md }}
                            />
                            <Text style={styles.infoText}>
                                Clique nos cards para visualizar todos os seus tickets por
                                status.
                            </Text>
                        </View>
                        <View style={styles.infoCard}>
                            <MaterialIcons
                                name="info"
                                size={20}
                                color={colors.info}
                                style={{ marginRight: spacing.md }}
                            />
                            <Text style={styles.infoText}>
                                Toque em um ticket da lista para ver os detalhes completos.
                            </Text>
                        </View>
                    </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
    },
    title: {
        ...typography.headingLg,
        color: colors.onSurface,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceVariant,
    },
    profileButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceVariant,
    },
    welcomeSection: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.primary,
    },
    welcomeText: {
        ...typography.bodyLg,
        color: colors.onPrimary,
    },
    userName: {
        fontWeight: '600',
    },
    highlightText: {
        ...typography.headingSm,
        color: colors.onPrimary,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        flexGrow: 1,
    },
    sectionTitle: {
        ...typography.headingMd,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    infoSection: {
        marginTop: spacing.xxl,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: colors.info,
    },
    infoText: {
        ...typography.bodyMd,
        color: colors.onSurface,
        flex: 1,
    },
});