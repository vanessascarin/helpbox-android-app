import { TextStyle } from 'react-native';

export const colors = {
    primary: '#2563EB',
    onPrimary: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    critical: '#EF4444',
    high: '#F97316',
    medium: '#F59E0B',
    low: '#10B981',
    surface: '#FFFFFF',
    surfaceVariant: '#F3F4F6',
    outline: '#D1D5DB',
    outlineVariant: '#E5E7EB',
    scrim: '#000000',
    onSurface: '#1F2937',
    onSurfaceVariant: '#6B7280',
    onSurfaceDisabled: '#9CA3AF',
    background: '#F9FAFB',
    onBackground: '#111827',
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

export const borderRadius = {
    sm: 6,
    md: 12,
    lg: 16,
    full: 999,
} as const;

export const typography: Record<string, TextStyle> = {
    headingXL: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
    headingLg: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    headingMd: { fontSize: 20, fontWeight: '700', lineHeight: 28 },
    headingSm: { fontSize: 16, fontWeight: '700', lineHeight: 24 },
    bodyLg: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodyMd: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    bodySm: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
    labelMd: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
};
// canonical theme exports (no re-exports)