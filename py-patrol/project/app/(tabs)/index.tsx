import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { species } from '../data/species';
import { getRecentAlerts } from '../data/alerts';
import AnimalCarousel from '../components/AnimalCarousel';
import AlertCard from '../components/AlertCard';
import { COLORS } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Dashboard() {
  const recentAlerts = getRecentAlerts(3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="shield-check" size={32} color={COLORS.primary} />
          <View style={styles.titleText}>
            <Text style={styles.title}>PyPatrol</Text>
            <Text style={styles.subtitle}>Protecting Miami's Natural Heritage</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="paw" size={24} color={COLORS.secondary} />
          <Text style={styles.sectionTitle}>Monitored Species</Text>
        </View>
        <AnimalCarousel species={species} />
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="bell-ring" size={24} color={COLORS.secondary} />
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
        </View>
        {recentAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.secondary,
  },
});