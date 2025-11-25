import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { validateLoginForm } from '../lib/utils';
import { useAuth } from '../lib/authContext';

export default function LoginScreen() {
    const { login, isLoading } = useAuth();
    
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        const validation = validateLoginForm(email, password);
        if (!validation.valid) {
            setError(validation.error || '');
            return;
        }

        setError('');
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
        }
    };

    const isFormValid = email.trim() !== '' && password.trim() !== '';

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <Image 
                            source={require('../assets/icon.png')} 
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        
                        <Text style={styles.title}>HelpBox</Text>
                        <Text style={styles.subtitle}>
                            Suporte aos chamados da Esfera Contabilidade
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputContainer, error && email === '' && styles.inputError]}>
                            <MaterialCommunityIcons
                                name="email"
                                size={20}
                                color={colors.onSurfaceVariant}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="seu@email.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={colors.onSurfaceDisabled}
                                editable={!isLoading}
                            />
                        </View>

                        <Text style={[styles.label, { marginTop: spacing.md }]}>Senha</Text>
                        <View style={[styles.inputContainer, error && password === '' && styles.inputError]}>
                            <MaterialCommunityIcons
                                name="lock"
                                size={20}
                                color={colors.onSurfaceVariant}
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Sua senha"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                placeholderTextColor={colors.onSurfaceDisabled}
                                editable={!isLoading}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye' : 'eye-off'}
                                    size={20}
                                    color={colors.onSurfaceVariant}
                                />
                            </TouchableOpacity>
                        </View>

                        {error && (
                            <View style={styles.errorMessage}>
                                <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={16}
                                    color={colors.error}
                                />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.primaryButton, (!isFormValid || isLoading) && styles.buttonDisabled]}
                            onPress={handleLogin}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.onPrimary} size="small" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Entrar</Text>
                            )}
                        </TouchableOpacity>

                        {/* MUDANÇA AQUI: Agora é apenas uma View com Text, sem clique */}
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>
                                Converse com seu gestor para criar uma nova conta ou recuperar sua senha.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    logoImage: {
        width: 100,
        height: 100,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.headingLg,
        color: colors.onBackground,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.bodyMd,
        color: colors.onSurfaceVariant,
        textAlign: 'center', // Centraliza o subtítulo também
    },
    formContainer: {
        marginBottom: spacing.xxl,
    },
    label: {
        ...typography.labelMd,
        color: colors.onSurface,
        marginBottom: spacing.sm,
        marginTop: spacing.lg,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outline,
    },
    inputError: {
        borderColor: colors.error,
    },
    input: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        ...typography.bodyMd,
        color: colors.onSurface,
    },
    errorMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.lg,
        gap: spacing.md,
    },
    errorText: {
        ...typography.bodySm,
        color: colors.error,
        flex: 1,
    },
    primaryButton: {
        marginTop: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        ...typography.labelMd,
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    // Novos estilos para o texto informativo (não clicável)
    infoContainer: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
    },
    infoText: {
        ...typography.bodySm, // Fonte menor e mais discreta
        color: colors.onSurfaceVariant, // Cor cinza suave
        textAlign: 'center',
        lineHeight: 20,
    },
});