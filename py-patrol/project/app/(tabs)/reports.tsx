import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../types';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function ReportsScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [date] = useState(new Date().toLocaleDateString());

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await getLocation();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await getLocation();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!image || !location) {
      Alert.alert('Error', 'Please ensure photo and location are available.');
      return;
    }

    // Handle report submission
    console.log('Report submitted', { image, location });
    Alert.alert(
      'Success',
      'Report submitted successfully!',
      [
        { 
          text: 'OK',
          onPress: () => {
            setImage(null);
            setLocation(null);
          }
        }
      ]
    );
  };

  if (!image) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New Report</Text>
          <Text style={styles.subtitle}>Start by taking a photo of the species</Text>
        </View>

        <View style={styles.cameraOptions}>
          <Pressable
            style={styles.cameraButton}
            onPress={handleTakePhoto}>
            <MaterialCommunityIcons name="camera" size={48} color={COLORS.primary} />
            <Text style={styles.buttonText}>Take Photo</Text>
            <Text style={styles.buttonSubtext}>Use your camera</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={styles.libraryButton}
            onPress={handleImageUpload}>
            <MaterialCommunityIcons name="image-multiple" size={48} color={COLORS.primary} />
            <Text style={styles.buttonText}>Choose Photo</Text>
            <Text style={styles.buttonSubtext}>From your library</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Submit Report</Text>
        <Text style={styles.subtitle}>Review and submit your report</Text>
      </View>

      <View style={styles.imagePreviewContainer}>
        <Image source={{ uri: image }} style={styles.imagePreview} />
        <View style={styles.imageActions}>
          <Pressable
            style={styles.imageActionButton}
            onPress={handleTakePhoto}>
            <MaterialCommunityIcons name="camera-retake" size={24} color={COLORS.primary} />
            <Text style={styles.imageActionText}>Retake</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formField}>
          <Text style={styles.label}>Species</Text>
          <View style={styles.input}>
            <MaterialCommunityIcons name="snake" size={24} color={COLORS.primary} />
            <Text style={styles.inputText}>Burmese Python</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.input}>
            <MaterialCommunityIcons name="map-marker" size={24} color={COLORS.primary} />
            <Text style={styles.inputText}>
              {location ? 
                `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` :
                'Detecting location...'}
            </Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.input}>
            <MaterialCommunityIcons name="calendar" size={24} color={COLORS.primary} />
            <Text style={styles.inputText}>{date}</Text>
          </View>
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Notes</Text>
          <View style={[styles.input, styles.textArea]}>
            <MaterialCommunityIcons 
              name="text" 
              size={24} 
              color={COLORS.primary}
              style={styles.textAreaIcon}
            />
            <Text style={[styles.inputText, styles.placeholder]}>
              Add any additional observations...
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.submitButton, !location && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!location}>
          <MaterialCommunityIcons name="send" size={24} color="white" />
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  cameraOptions: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  libraryButton: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
  },
  buttonSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.textLight,
    fontSize: 16,
  },
  imagePreviewContainer: {
    margin: 24,
    height: 240,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageActions: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  imageActionButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageActionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  formContainer: {
    margin: 24,
  },
  formField: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  textArea: {
    alignItems: 'flex-start',
    minHeight: 100,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  placeholder: {
    color: COLORS.textLight,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});