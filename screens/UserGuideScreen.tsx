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
import Header from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'UserGuide'>;

interface GuideItem {
    icon: string;
    title: string;
    description: string;
}

const guideItems: GuideItem[] = [
    {
        icon: 'dashboard',
        title: 'Dashboard Principal',
        description:
            'Na tela inicial você verá estatísticas dos seus tickets. Três cards mostram a quantidade de tickets abertos, em andamento e concluídos. Clique em cada card para visualizar a lista completa.',
    },
    {
        icon: 'list',
        title: 'Lista de Tickets',
        description:
            'Após clicar em um status, você verá todos os tickets daquele status listados. Cada card exibe ID, título, solicitante e nível de criticidade. Toque em qualquer ticket para ver os detalhes completos.',
    },
    {
        icon: 'description',
        title: 'Detalhes do Ticket',
        description:
            'Ao abrir um ticket, você poderá ver informações completas: ID, categoria, datas de abertura e atualização, quem abriu, descrição detalhada e o nível de criticidade.',
    },
    {
        icon: 'account-circle',
        title: 'Perfil do Usuário',
        description:
            'Acesse seu perfil tocando no ícone redondo no canto superior direito. Aqui você pode ver suas informações pessoais, gerenciar preferências e fazer logout.',
    },
    {
        icon: 'priority-high',
        title: 'Entendendo os Níveis de Criticidade',
        description:
            'Crítico (Vermelho): Urgente, prejudica operações. Alto (Laranja): Importante, deve ser resolvido. Médio (Amarelo): Moderado. Baixo (Verde): Menor prioridade.',
    },
    {
        icon: 'info',
        title: 'Status dos Tickets',
        description:
            'Aberto: Ticket recém criado. Em Andamento: Alguém está trabalhando na solução. Fechado: Problema foi resolvido.',
    },
];

export default function UserGuideScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
            <View style={styles.container}>
                <Header title="Manual do Usuário" showBack onBack={() => navigation.goBack()} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Introdução */}
                    <View style={styles.introSection}>
                        <Text style={styles.introTitle}>Bem-vindo ao HelpBox!</Text>
                        <Text style={styles.introText}>
                            Este aplicativo ajuda você a gerenciar e acompanhar solicitações de
                            suporte técnico. Abaixo estão os principais recursos e como usá-los.
                        </Text>
                    </View>

                    {/* Itens do guia */}
                    {guideItems.map((item, index) => (
                        <View key={index} style={styles.guideCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconContainer}>
                                    <MaterialIcons
                                        name={item.icon as any}
                                        size={24}
                                        color="#3e4487"
                                    />
                                </View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                            </View>
                            <Text style={styles.cardDescription}>{item.description}</Text>
                        </View>
                    ))}

                    {/* Dicas finais */}
                    <View style={styles.tipsSection}>
                        <Text style={styles.tipsTitle}>💡 Dicas Úteis</Text>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>
                                Verifique regularmente seus tickets abertos para não perder nenhum.
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>
                                Todos os tickets têm um nível de criticidade para priorizar as
                                ações.
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>
                                Você pode acompanhar o progresso pelo status do ticket.
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
    introSection: {
        backgroundColor: '#3e4487',
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },
    introTitle: {
        ...typography.headingMd,
        color: colors.onPrimary,
        marginBottom: spacing.md,
    },
    introText: {
        ...typography.bodyMd,
        color: colors.onPrimary,
        lineHeight: 22,
    },
    guideCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: '#3e4487',
        shadowColor: colors.scrim,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    cardTitle: {
        ...typography.headingSm,
        color: colors.onSurface,
        flex: 1,
    },
    cardDescription: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        lineHeight: 22,
    },
    tipsSection: {
        backgroundColor: '#3e4487',
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginVertical: spacing.xl,
    },
    tipsTitle: {
        ...typography.headingSm,
        color: colors.onPrimary,
        marginBottom: spacing.md,
    },
    tipItem: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    tipBullet: {
        ...typography.bodyMd,
        color: colors.onPrimary,
        marginRight: spacing.md,
        marginTop: spacing.xs,
    },
    tipText: {
        ...typography.bodyMd,
        color: colors.onPrimary,
        flex: 1,
        lineHeight: 22,
    },
    supportSection: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.outlineVariant,
        marginBottom: spacing.xl,
    },
    supportTitle: {
        ...typography.headingSm,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    supportText: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: 22,
    },
});