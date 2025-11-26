import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../lib/authContext';
import { colors, spacing, borderRadius, typography } from '../lib/theme';
import Header from '../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
    // Usamos 'any' no user para evitar erro de TS caso o tipo User não tenha sido atualizado ainda com 'level'
    const { user, logout } = useAuth() as any; 

    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sair", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error(error);
                        }
                    } 
                }
            ]
        );
    };

    // Função para deixar o nível mais amigável
    const getNivelLabel = (nivel: number) => {
        if (nivel >= 3) return 'Master / Admin';
        if (nivel === 2) return 'Técnico de Suporte';
        return 'Usuário Padrão';
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <Header 
                    title="Meu Perfil" 
                    showBack 
                    onBack={() => navigation.goBack()} 
                />

                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Cabeçalho do Perfil */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <MaterialIcons name="person" size={64} color="#ffff" />
                        </View>
                        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
                        {/* Exibe o ID logo abaixo do nome, bem discreto */}
                        <Text style={styles.userId}>ID: {user?.id}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Informações da Conta</Text>
                    
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <MaterialIcons name="badge" size={24} color='#3e4487' style={styles.icon} />
                            <View>
                                <Text style={styles.label}>Nível de Acesso</Text>
                                <Text style={styles.value}>
                                    {user?.level} - {getNivelLabel(user?.level)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                    
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <MaterialIcons name="email" size={24} color='#3e4487' style={styles.icon} />
                            <View>
                                <Text style={styles.label}>E-mail</Text>
                                <Text style={styles.value}>{user?.email || 'Não informado'}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.row}>
                            <MaterialIcons name="business" size={24} color='#3e4487' style={styles.icon} />
                            <View>
                                <Text style={styles.label}>Departamento</Text>
                                <Text style={styles.value}>{user?.department || 'Geral'}</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialIcons name="logout" size={20} color="#FFF" style={{ marginRight: 8 }} />
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
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.md,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor:'#3e4487ff', 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userName: {
        ...typography.headingMd,
        color: colors.onBackground,
        textAlign: 'center',
    },
    userId: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginTop: 4,
    },
    sectionTitle: {
        ...typography.headingSm,
        color: colors.onSurface,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.outlineVariant,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: spacing.lg,
    },
    label: {
        ...typography.bodySm,
        color: colors.onSurfaceVariant,
        marginBottom: 2,
    },
    value: {
        ...typography.bodyLg,
        color: colors.onSurface,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor:'#C62828',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.xl,
    },
    logoutText: {
        ...typography.labelLg,
        color: '#FFF',
        fontWeight: 'bold',
    },
});