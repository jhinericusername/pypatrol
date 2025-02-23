import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../types';
import { species } from '../data/species';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPECIES_CARD_WIDTH = 100;
const SPECIES_CARD_HEIGHT = 60;

export default function HeatmapScreen() {
  const [selectedSpecies, setSelectedSpecies] = useState(species[0]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speciesSelector}>
        {species.map((animal) => (
          <Pressable
            key={animal.id}
            style={[
              styles.speciesCard,
              selectedSpecies.id === animal.id && styles.selectedSpeciesCard,
            ]}
            onPress={() => setSelectedSpecies(animal)}>
            <Image source={{ uri: animal.imageUrl }} style={styles.speciesImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.speciesOverlay}>
              <Text style={styles.speciesName}>{animal.name}</Text>
            </LinearGradient>
            {selectedSpecies.id === animal.id && (
              <View style={styles.selectedIndicator}>
                <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.accent} />
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{selectedSpecies.name}</Text>
            <Text style={styles.scientificName}>{selectedSpecies.scientificName}</Text>
          </View>
          <View style={[
            styles.dangerIndicator,
            {
              backgroundColor:
                selectedSpecies.dangerLevel === 'high' ? COLORS.danger :
                selectedSpecies.dangerLevel === 'medium' ? COLORS.warning :
                COLORS.info
            }
          ]}>
            <Text style={styles.dangerText}>
              {selectedSpecies.dangerLevel.toUpperCase()} RISK
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{selectedSpecies.description}</Text>

        <View style={styles.heatmapContainer}>
          <View style={styles.heatmapHeader}>
            <MaterialCommunityIcons name="map-marker-radius" size={24} color={COLORS.secondary} />
            <Text style={styles.heatmapTitle}>Population Distribution</Text>
          </View>
          
          <Image 
            source={{ uri: selectedSpecies.heatmapUrl }} 
            style={styles.heatmap}
            resizeMode="contain"
          />

          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Population Density</Text>
            <LinearGradient
              colors={[COLORS.danger, COLORS.warning, COLORS.info]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.legendGradient}
            />
            <View style={styles.legendLabels}>
              <Text style={styles.legendLabel}>High</Text>
              <Text style={styles.legendLabel}>Medium</Text>
              <Text style={styles.legendLabel}>Low</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  speciesSelector: {
    padding: 12,
    backgroundColor: COLORS.primary,
    maxHeight: SPECIES_CARD_HEIGHT + 24,
  },
  speciesCard: {
    width: SPECIES_CARD_WIDTH,
    height: SPECIES_CARD_HEIGHT,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedSpeciesCard: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  speciesImage: {
    width: '100%',
    height: '100%',
  },
  speciesOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 4,
  },
  speciesName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.textLight,
  },
  dangerIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dangerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  heatmapContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heatmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  heatmapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  heatmap: {
    width: '100%',
    height: SCREEN_WIDTH - 64,
    borderRadius: 8,
    marginBottom: 16,
  },
  legend: {
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  legendGradient: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});