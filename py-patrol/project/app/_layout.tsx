import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { COLORS } from './types';

export default function RootLayout() {
  // Prevent web access
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webError}>
        <Text style={styles.webErrorText}>
          PyPatrol is only available on iOS and Android devices.
        </Text>
      </View>
    );
  }

  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
      });
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.content}>
          <Text style={styles.title}>PyPatrol</Text>
          <Text style={styles.subtitle}>Protecting Miami's Natural Heritage</Text>
          <Text style={styles.slogan}>Together we safeguard our ecosystem</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  webError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  webErrorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: COLORS.accent,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 16,
    color: '#A7F3D0',
    fontStyle: 'italic',
  },
});