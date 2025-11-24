import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    Platform,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../lib/theme';

interface HeaderProps {
    title?: string | React.ReactNode;
    subtitle?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    bottomBorderColor?: string;
    style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    left,
    right,
    showBack,
    onBack,
    bottomBorderColor,
    style,
}) => {
    return (
        <SafeAreaView
            edges={["top"]}
            style={[styles.safeArea, { backgroundColor: colors.surface }]}
        >
            <View style={[styles.container, { borderBottomColor: bottomBorderColor || colors.outlineVariant }, style]}>
                <View style={styles.side}>{left ? left : showBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.iconButton} accessibilityLabel="Voltar">
                        <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
                    </TouchableOpacity>
                ) : (
                    // show app logo when no left slot and no back button
                    <View style={styles.logoWrapper}>
                        <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
                    </View>
                )}</View>

                <View style={styles.center}>
                    {typeof title === 'string' ? (
                        <Text style={styles.title}>{title}</Text>
                    ) : (
                        title
                    )}
                    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                </View>

                <View style={styles.side}>{right ? right : <View style={{ width: 40 }} />}</View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        width: '100%',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    side: {
        width: 80,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceVariant,
    },
    logoWrapper: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    logo: {
        width: 36,
        height: 36,
    },
});

export default Header;
