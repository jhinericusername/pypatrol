import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { COLORS } from '../types';
import { Species } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(WINDOW_WIDTH * 0.8, 400);
const CARD_MARGIN = 10;

interface AnimalCarouselProps {
  species: Species[];
  onSpeciesPress?: (species: Species) => void;
}

export default function AnimalCarousel({ species, onSpeciesPress }: AnimalCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      {species.map((animal) => (
        <Pressable
          key={animal.id}
          onPress={() => onSpeciesPress?.(animal)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Image source={{ uri: animal.imageUrl }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.overlay}>
              <Text style={styles.name}>{animal.name}</Text>
              <Text style={styles.scientificName}>{animal.scientificName}</Text>
            </LinearGradient>
            <View style={[
              styles.dangerIndicator,
              { backgroundColor: animal.dangerLevel === 'high' ? COLORS.danger : 
                               animal.dangerLevel === 'medium' ? COLORS.warning : 
                               COLORS.info }
            ]} />
          </Animated.View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  contentContainer: {
    paddingHorizontal: CARD_MARGIN,
    paddingVertical: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 250,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scientificName: {
    color: COLORS.accent,
    fontSize: 16,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dangerIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
});