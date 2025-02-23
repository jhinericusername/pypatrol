import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Species } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../types';

interface SpeciesCardProps {
  species: Species;
  onPress?: () => void;
}

export default function SpeciesCard({ species, onPress }: SpeciesCardProps) {
  const getDangerIcon = () => {
    switch (species.dangerLevel) {
      case 'high':
        return { name: 'alert-circle', color: COLORS.danger };
      case 'medium':
        return { name: 'alert', color: COLORS.warning };
      case 'low':
        return { name: 'information', color: COLORS.info };
    }
  };

  const icon = getDangerIcon();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: species.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{species.name}</Text>
          <MaterialCommunityIcons name={icon.name} size={24} color={icon.color} />
        </View>
        <Text style={styles.scientificName}>{species.scientificName}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {species.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});