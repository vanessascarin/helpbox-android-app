import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './types';

import { AuthProvider, useAuth } from './lib/authContext';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TicketsScreen from './screens/TicketScreen';
import TicketDetailScreen from './screens/TicketDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserGuideScreen from './screens/UserGuideScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ErrorBoundary to catch runtime render errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: any }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, info: any) {
        console.error('Erro capturado pelo ErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#FEF3F2' }}>
                    <Text style={{ color: '#B91C1C', fontWeight: '700', marginBottom: 8 }}>Ocorreu um erro</Text>
                    <Text style={{ color: '#7F1D1D', textAlign: 'center' }}>
                        Algo deu errado ao carregar o aplicativo. Por favor, atualize o preview ou confira os logs.
                    </Text>
                </View>
            );
        }
        return this.props.children as React.ReactElement;
    }
}

function AuthStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'default',
            }}
        >
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    animation: 'none',
                }}
            />
        </Stack.Navigator>
    );
}

function AppStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'default',
            }}
        >
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Tickets" component={TicketsScreen} />
            <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="UserGuide" component={UserGuideScreen} />
        </Stack.Navigator>
    );
}

function RootNavigator() {
    const { isSignedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={{ marginTop: 12, color: '#374151' }}>Carregando...</Text>
            </View>
        );
    }

    return isSignedIn ? <AppStack /> : <AuthStack />;
}

function AppContent() {
    return (
        <NavigationContainer>
            <RootNavigator />
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <SafeAreaProvider style={styles.container}>
            <AuthProvider>
                <ErrorBoundary>
                    <AppContent />
                </ErrorBoundary>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});