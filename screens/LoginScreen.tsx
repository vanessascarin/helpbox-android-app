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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { validateLoginForm, validateRegisterForm } from '../lib/utils';
import { useAuth } from '../lib/authContext';

type LoginMode = 'login' | 'register';

export default function LoginScreen() {
    const { login, register, isLoading } = useAuth();
    const [mode, setMode] = useState<LoginMode>('login');
    
    // --- MUDANÇA AQUI: Iniciamos com strings vazias ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    
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

    const handleRegister = async () => {
        const validation = validateRegisterForm(name, email, password, department);
        if (!validation.valid) {
            setError(validation.error || '');
            return;
        }

        setError('');
        try {
            await register(name, email, password, department);
        } catch (err: any) {
            setError(err.message || 'Erro ao registrar');
        }
    };

    const handleSwitchMode = () => {
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        setDepartment('');
        setMode(mode === 'login' ? 'register' : 'login');
    };

    const isFormValid =
        mode === 'login'
            ? email.trim() !== '' && password.trim() !== ''
            : email.trim() !== '' && password.trim() !== '' && name.trim() !== '' && department.trim() !== '';

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
                        <MaterialCommunityIcons
                            name={'ticket'}
                            size={60}
                            color={colors.primary}
                            style={styles.icon}
                        />
                        <Text style={styles.title}>HelpBox</Text>
                        <Text style={styles.subtitle}>
                            {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        {mode === 'register' && (
                            <>
                                <Text style={styles.label}>Nome Completo</Text>
                                <View style={[styles.inputContainer, error && name === '' && styles.inputError]}>
                                    <MaterialCommunityIcons
                                        name="account"
                                        size={20}
                                        color={colors.onSurfaceVariant}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="João Silva"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor={colors.onSurfaceDisabled}
                                        editable={!isLoading}
                                    />
                                </View>
                            </>
                        )}

                        <Text style={[styles.label, mode === 'register' && { marginTop: spacing.md }]}>
                            Email
                        </Text>
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

                        {mode === 'register' && (
                            <>
                                <Text style={[styles.label, { marginTop: spacing.md }]}>Departamento</Text>
                                <View
                                    style={[styles.inputContainer, error && department === '' && styles.inputError]}
                                >
                                    <MaterialCommunityIcons
                                        name="office-building"
                                        size={20}
                                        color={colors.onSurfaceVariant}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="ex: TI, Suporte, RH"
                                        value={department}
                                        onChangeText={setDepartment}
                                        placeholderTextColor={colors.onSurfaceDisabled}
                                        editable={!isLoading}
                                    />
                                </View>
                            </>
                        )}

                        <Text style={[styles.label, mode === 'register' && { marginTop: spacing.md }]}>
                            Senha
                        </Text>
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
                            onPress={mode === 'login' ? handleLogin : handleRegister}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.onPrimary} size="small" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    {mode === 'login' ? 'Entrar' : 'Registrar'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleSwitchMode}
                            disabled={isLoading}
                        >
                            <Text style={styles.secondaryButtonText}>
                                {mode === 'login'
                                    ? 'Converse com seu gestor para criar uma nova conta.'
                                    : 'Já tem conta? Faça login'}
                            </Text>
                        </TouchableOpacity>
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
    icon: {
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
    secondaryButton: {
        marginTop: spacing.md,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    secondaryButtonText: {
        ...typography.bodyMd,
        color: colors.primary,
    },
});