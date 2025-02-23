import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../types';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          color: 'white',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginBottom: -3,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
          headerTitle: 'PyPatrol Dashboard',
          headerTitleStyle: {
            color: 'white',
          },
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          title: 'Heatmap',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-radius" size={size} color={color} />
          ),
          headerTitle: 'Species Heatmap',
          headerTitleStyle: {
            color: 'white',
          },
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="camera-plus" size={size} color={color} />
          ),
          headerTitle: 'Submit Report',
          headerTitleStyle: {
            color: 'white',
          },
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell-ring" size={size} color={color} />
          ),
          headerTitle: 'Recent Alerts',
          headerTitleStyle: {
            color: 'white',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-account" size={size} color={color} />
          ),
          headerTitle: 'Guardian Profile',
          headerTitleStyle: {
            color: 'white',
          },
        }}
      />
    </Tabs>
  );
}