import React from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {theme} from '../theme';
import {getUserProfile} from '../data/mockData';

export default function UserProfileScreen({route}: any) {
  const {userId} = route.params || {};
  const user = getUserProfile(userId);

  const calendarDays = [];
  for (let i = 1; i <= 31; i++) {
    const dateStr = `2026-03-${String(i).padStart(2, '0')}`;
    const dayData = user.history[dateStr];
    calendarDays.push({day: i, data: dayData});
  }

  return (
    <ScrollView style={s.container}>
      {/* Hero */}
      <View style={s.hero}>
        <Image source={{uri: user.avatar}} style={s.avatarLg} />
        <View>
          <Text style={s.heroName}>{user.name}</Text>
          <Text style={s.heroEmail}>{user.email || 'Membro de Grupo'}</Text>
          <View style={s.badgeRow}>
            <View style={s.badge}><Text style={s.badgeText}>🔥 {user.streak} dias</Text></View>
            <View style={s.badge}><Text style={s.badgeText}>{user.level}</Text></View>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statIcon}>✅</Text>
          <Text style={s.statValue}>{user.checkIns}</Text>
          <Text style={s.statLabel}>Check-ins</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statIcon}>📅</Text>
          <Text style={s.statValue}>{user.activeDays}</Text>
          <Text style={s.statLabel}>Dias Ativos</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statIcon}>⏱️</Text>
          <Text style={s.statValue}>{user.activeTime}</Text>
          <Text style={s.statLabel}>Tempo</Text>
        </View>
      </View>

      {/* Calendar */}
      <Text style={s.section}>📅 Calendário de Treinos</Text>
      <View style={s.calGrid}>
        {calendarDays.map(({day, data}) => (
          <View key={day} style={[s.calCell, data && s.calCellActive]}>
            {data?.photo ? (
              <Image source={{uri: data.photo}} style={s.calPhoto} />
            ) : data ? (
              <Text style={s.calCheck}>✓</Text>
            ) : (
              <Text style={s.calDay}>{day}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.bgPrimary, padding: 16},
  hero: {flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: theme.colors.bgSecondary, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border},
  avatarLg: {width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: theme.colors.primary},
  heroName: {fontSize: 20, fontWeight: '700', color: theme.colors.textPrimary},
  heroEmail: {fontSize: 13, color: theme.colors.textMuted, marginBottom: 6},
  badgeRow: {flexDirection: 'row', gap: 8},
  badge: {backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12},
  badgeText: {fontSize: 11, fontWeight: '600', color: theme.colors.textSecondary},
  statsRow: {flexDirection: 'row', gap: 12, marginBottom: 24},
  statCard: {flex: 1, backgroundColor: theme.colors.bgSecondary, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border},
  statIcon: {fontSize: 20, marginBottom: 6},
  statValue: {fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary},
  statLabel: {fontSize: 11, color: theme.colors.textMuted, marginTop: 2},
  section: {fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 14},
  calGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  calCell: {width: '13%', aspectRatio: 1, backgroundColor: theme.colors.bgSecondary, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden'},
  calCellActive: {borderColor: 'rgba(124,58,237,0.3)'},
  calDay: {fontSize: 12, color: theme.colors.textMuted},
  calCheck: {fontSize: 14, color: theme.colors.primary, fontWeight: '700'},
  calPhoto: {width: '100%', height: '100%'},
});
