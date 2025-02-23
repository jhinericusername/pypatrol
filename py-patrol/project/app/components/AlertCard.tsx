import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, COLORS } from '../types';

interface AlertCardProps {
  alert: Alert;
  onPress?: (alert: Alert) => void;
}

export default function AlertCard({ alert, onPress }: AlertCardProps) {
  const getAlertIcon = () => {
    switch (alert.type) {
      case 'danger':
        return { name: 'alert-circle', color: COLORS.danger };
      case 'warning':
        return { name: 'alert', color: COLORS.warning };
      case 'info':
        return { name: 'information', color: COLORS.info };
    }
  };

  const icon = getAlertIcon();
  const formattedDate = new Date(alert.timestamp).toLocaleDateString();

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress?.(alert)}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon.name} size={24} color={icon.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {alert.message}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.location}>{alert.location.address}</Text>
          <Text style={styles.timestamp}>{formattedDate}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: COLORS.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});