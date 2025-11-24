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
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import { useAuth } from '../lib/authContext';
import Header from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    if (!user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.headerTitle}>Usuário não encontrado</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <Header
                    title="Meu Perfil"
                    showBack
                    onBack={() => navigation.goBack()}
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Avatar */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatar}>
                            <MaterialIcons
                                name="account-circle"
                                size={80}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.userName}>{user.name}</Text>
                    </View>

                    {/* Informações do usuário */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <MaterialIcons
                                    name="email"
                                    size={20}
                                    color={colors.primary}
                                    style={{ marginRight: spacing.md }}
                                />
                                <Text style={styles.infoLabel}>E-mail</Text>
                            </View>
                            <Text style={styles.infoValue}>{user.email}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <View style={styles.infoHeader}>
                                <MaterialIcons
                                    name="business"
                                    size={20}
                                    color={colors.primary}
                                    style={{ marginRight: spacing.md }}
                                />
                                <Text style={styles.infoLabel}>Departamento</Text>
                            </View>
                            <Text style={styles.infoValue}>
                                {user.department || 'Não especificado'}
                            </Text>
                        </View>
                    </View>

                    {/* Preferências */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferências</Text>

                        <TouchableOpacity style={styles.preferenceItem}>
                            <View style={styles.preferenceHeader}>
                                <MaterialIcons
                                    name="notifications"
                                    size={20}
                                    color={colors.onSurfaceVariant}
                                    style={{ marginRight: spacing.md }}
                                />
                                <Text style={styles.preferenceLabel}>
                                    Notificações
                                </Text>
                            </View>
                            <MaterialIcons
                                name="toggle-on"
                                size={24}
                                color={colors.success}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.preferenceItem}>
                            <View style={styles.preferenceHeader}>
                                <MaterialIcons
                                    name="dark-mode"
                                    size={20}
                                    color={colors.onSurfaceVariant}
                                    style={{ marginRight: spacing.md }}
                                />
                                <Text style={styles.preferenceLabel}>Modo Escuro</Text>
                            </View>
                            <MaterialIcons
                                name="toggle-off"
                                size={24}
                                color={colors.outline}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Sobre */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sobre</Text>

                        <View style={styles.aboutCard}>
                            <View style={styles.aboutRow}>
                                <Text style={styles.aboutLabel}>Versão do App:</Text>
                                <Text style={styles.aboutValue}>1.0.0</Text>
                            </View>
                            <View style={styles.aboutRow}>
                                <Text style={styles.aboutLabel}>Última Atualização:</Text>
                                <Text style={styles.aboutValue}>12/01/2025</Text>
                            </View>
                        </View>
                    </View>

                    {/* Botão de logout */}
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <MaterialIcons
                            name="logout"
                            size={20}
                            color={colors.onPrimary}
                            style={{ marginRight: spacing.md }}
                        />
                        <Text style={styles.logoutText}>Sair</Text>
                    </TouchableOpacity>
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    userName: {
        ...typography.headingMd,
        color: colors.onSurface,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.headingSm,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    infoCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    infoLabel: {
        ...typography.labelMd,
        color: colors.onSurfaceVariant,
    },
    infoValue: {
        ...typography.bodyMd,
        color: colors.onSurface,
        marginLeft: spacing.xxxl,
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },
    preferenceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    preferenceLabel: {
        ...typography.bodyMd,
        color: colors.onSurface,
    },
    aboutCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
    },
    aboutLabel: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
    },
    aboutValue: {
        ...typography.bodyMd,
        color: colors.onSurface,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: colors.error,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    logoutText: {
        ...typography.headingSm,
        color: colors.onPrimary,
    },
});