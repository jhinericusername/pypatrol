import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../types';
import { alerts } from '../data/alerts';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';

export default function AlertsScreen() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const router = useRouter();

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return { name: 'alert-circle', color: COLORS.danger };
      case 'warning':
        return { name: 'alert', color: COLORS.warning };
      case 'info':
        return { name: 'information', color: COLORS.info };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {alerts.map((alert) => (
          <Pressable
            key={alert.id}
            style={styles.alertCard}
            onPress={() => setSelectedAlert(alert)}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons
                name={getAlertIcon(alert.type).name}
                size={24}
                color={getAlertIcon(alert.type).color}
              />
              <Text style={styles.timestamp}>
                {new Date(alert.timestamp).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.species}>{alert.species.name}</Text>
            <Text style={styles.message} numberOfLines={2}>
              {alert.message}
            </Text>
            <Text style={styles.location}>{alert.location.address}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={selectedAlert !== null}
        animationType="slide"
        onRequestClose={() => setSelectedAlert(null)}>
        {selectedAlert && (
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              <View style={styles.alertInfo}>
                <MaterialCommunityIcons
                  name={getAlertIcon(selectedAlert.type).name}
                  size={24}
                  color={getAlertIcon(selectedAlert.type).color}
                />
                <Text style={styles.modalSpecies}>{selectedAlert.species.name}</Text>
                <Text style={styles.modalTimestamp}>
                  {new Date(selectedAlert.timestamp).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.modalTitle}>{selectedAlert.title}</Text>
              <Text style={styles.modalMessage}>{selectedAlert.message}</Text>
              <Text style={styles.modalLocation}>{selectedAlert.location.address}</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedAlert.location.latitude,
                    longitude: selectedAlert.location.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  }}>
                  <Marker
                    coordinate={{
                      latitude: selectedAlert.location.latitude,
                      longitude: selectedAlert.location.longitude,
                    }}
                    title={selectedAlert.title}
                    description={selectedAlert.species.name}
                  />
                </MapView>
              </View>
              <View style={styles.navigationButtons}>
                <Pressable
                  onPress={() => setSelectedAlert(null)}
                  style={styles.backButton}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
                  <Text style={styles.buttonText}>Back to Alerts</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setSelectedAlert(null);
                    router.replace('/(tabs)');
                  }}
                  style={styles.dashboardButton}>
                  <MaterialCommunityIcons name="view-dashboard" size={24} color="white" />
                  <Text style={styles.dashboardButtonText}>Return to Dashboard</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  alertCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  species: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  alertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  modalSpecies: {
    fontSize: 16,
    color: COLORS.primary,
    flex: 1,
  },
  modalTimestamp: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
    lineHeight: 24,
  },
  modalLocation: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 16,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  map: {
    flex: 1,
  },
  navigationButtons: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  dashboardButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});