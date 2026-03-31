import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import {theme} from '../theme';
import {mockGroups, mockRankings} from '../data/mockData';

export default function GroupInfoScreen({route, navigation}: any) {
  const {groupId} = route.params || {};
  const group = mockGroups.find(g => g.id === groupId) || mockGroups[0];
  const participants = mockRankings.weekly;
  const admin = participants[0];

  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{flex: 1}}><Text style={s.backBtn}>← Voltar</Text></TouchableOpacity>
        <Text style={s.title}>Detalhes</Text>
        <View style={{flex: 1}} />
      </View>

      <View style={s.heroCard}>
        <View style={s.iconWrapper}>
          <Text style={s.heroIcon}>{group.type === 'challenge' ? '⭐' : '👥'}</Text>
        </View>
        <Text style={s.heroName}>{group.name}</Text>
        <Text style={s.heroDate}>Criado em 5 de agosto, 2025</Text>
      </View>

      <View style={s.card}>
        <Text style={s.sectionTitle}>Administrador</Text>
        <TouchableOpacity style={s.adminRow} onPress={() => navigation.navigate('UserProfile', {userId: admin.userId})}>
          <Image source={{uri: admin.avatar}} style={s.adminAvatar} />
          <View>
            <Text style={s.adminName}>{admin.name}</Text>
            <Text style={s.adminLabel}>Criador do Grupo</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <View style={s.partHeader}>
          <Text style={s.sectionTitle}>Participantes ({participants.length})</Text>
          <TouchableOpacity onPress={() => Alert.alert('Aviso', 'Mock não suporta listagem completa.')}>
            <Text style={s.viewAll}>Ver Todas</Text>
          </TouchableOpacity>
        </View>
        <View style={s.avatarGrid}>
          {participants.slice(0, 8).map(p => (
            <TouchableOpacity key={p.userId} onPress={() => navigation.navigate('UserProfile', {userId: p.userId})}>
              <Image source={{uri: p.avatar}} style={s.partAvatar} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={s.leaveBtn} onPress={() => navigation.navigate('Groups')}>
        <Text style={s.leaveText}>Sair do Grupo</Text>
      </TouchableOpacity>
      
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.bgPrimary, padding: 16},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingVertical: 8},
  backBtn: {color: theme.colors.textMuted, fontSize: 16},
  title: {fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary},
  heroCard: {backgroundColor: theme.colors.bgSecondary, padding: 24, borderRadius: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border},
  iconWrapper: {width: 64, height: 64, borderRadius: 20, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12},
  heroIcon: {fontSize: 32},
  heroName: {fontSize: 22, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4},
  heroDate: {fontSize: 13, color: theme.colors.textMuted},
  card: {backgroundColor: theme.colors.bgSecondary, padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border},
  sectionTitle: {fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 12},
  adminRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  adminAvatar: {width: 48, height: 48, borderRadius: 24},
  adminName: {fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary},
  adminLabel: {fontSize: 12, color: theme.colors.primary},
  partHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16},
  viewAll: {color: theme.colors.primary, fontSize: 13, fontWeight: '600'},
  avatarGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  partAvatar: {width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.border},
  leaveBtn: {backgroundColor: 'rgba(239,68,68,0.1)', padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', marginTop: 8},
  leaveText: {color: '#F87171', fontWeight: '700', fontSize: 15}
});
