import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../lib/theme';

interface StatCardProps {
  label: string;
  count: number;
  color: string;
  icon: string;
  onPress: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  count,
  color,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={24}
        color={colors.onSurfaceVariant}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.scrim,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  content: {
    flex: 1,
  },
  count: {
    ...typography.headingMd,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
});