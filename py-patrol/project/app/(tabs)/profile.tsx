import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STAT_SIZE = Math.min(160, (SCREEN_WIDTH - 48) / 2);

const PROFILE_DATA = {
  name: 'Prateek Mishra',
  title: 'Wildlife Guardian',
  level: 15,
  xp: 2750,
  xpToNextLevel: 3000,
  profileImage: 'https://i.imgur.com/HZBRmGw.jpg',
  stats: {
    reportsSubmitted: 47,
    successfulCaptures: 23,
    speciesTracked: 6,
    hoursInField: 156,
  },
  badges: [
    { 
      id: '1', 
      name: 'Python Hunter', 
      icon: 'snake', 
      description: 'Successfully tracked 10 Burmese Pythons',
      color: '#FF6B6B'
    },
    { 
      id: '2', 
      name: 'First Response', 
      icon: 'shield-alert', 
      description: 'Responded to 25 wildlife alerts',
      color: '#4ECDC4'
    },
    { 
      id: '3', 
      name: 'Data Collector', 
      icon: 'file-document-multiple', 
      description: 'Submitted 50 field reports',
      color: '#45B7D1'
    },
    { 
      id: '4', 
      name: 'Guardian Elite', 
      icon: 'medal', 
      description: 'Reached Level 15',
      color: '#96CEB4'
    },
  ],
};

export default function ProfileScreen() {
  const xpProgress = (PROFILE_DATA.xp / PROFILE_DATA.xpToNextLevel) * 100;
  const xpRemaining = PROFILE_DATA.xpToNextLevel - PROFILE_DATA.xp;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: PROFILE_DATA.profileImage }} 
            style={styles.profileImage}
          />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{PROFILE_DATA.level}</Text>
          </View>
        </View>

        <Text style={styles.name}>{PROFILE_DATA.name}</Text>
        <Text style={styles.title}>{PROFILE_DATA.title}</Text>

        <View style={styles.xpContainer}>
          <View style={styles.xpBar}>
            <LinearGradient
              colors={[COLORS.accent, COLORS.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.xpProgress, { width: `${xpProgress}%` }]}
            />
          </View>
          <Text style={styles.xpText}>
            {PROFILE_DATA.xp} / {PROFILE_DATA.xpToNextLevel} XP
          </Text>
          <Text style={styles.xpRemaining}>{xpRemaining} XP to Level {PROFILE_DATA.level + 1}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={[styles.statItem, { width: STAT_SIZE }]}>
            <MaterialCommunityIcons name="clipboard-text-clock" size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>{PROFILE_DATA.stats.reportsSubmitted}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={[styles.statItem, { width: STAT_SIZE }]}>
            <MaterialCommunityIcons name="target-account" size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>{PROFILE_DATA.stats.successfulCaptures}</Text>
            <Text style={styles.statLabel}>Captures</Text>
          </View>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.statItem, { width: STAT_SIZE }]}>
            <MaterialCommunityIcons name="paw-group" size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>{PROFILE_DATA.stats.speciesTracked}</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
          <View style={[styles.statItem, { width: STAT_SIZE }]}>
            <MaterialCommunityIcons name="clock-time-eight" size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>{PROFILE_DATA.stats.hoursInField}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>
      </View>

      <View style={styles.badgesSection}>
        <Text style={styles.sectionTitle}>Badges Earned</Text>
        <View style={styles.badgesGrid}>
          {PROFILE_DATA.badges.map((badge) => (
            <View key={badge.id} style={styles.badgeItem}>
              <LinearGradient
                colors={[badge.color, COLORS.primary]}
                style={styles.badgeIcon}>
                <MaterialCommunityIcons name={badge.icon} size={36} color="white" />
              </LinearGradient>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDescription}>{badge.description}</Text>
            </View>
          ))}
        </View>
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
    alignItems: 'center',
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
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  xpContainer: {
    width: '100%',
    alignItems: 'center',
  },
  xpBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpProgress: {
    height: '100%',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  xpRemaining: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  statsContainer: {
    padding: 16,
    marginTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    height: STAT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  badgesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});