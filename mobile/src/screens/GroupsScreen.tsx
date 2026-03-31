import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {theme} from '../theme';
import {mockGroups} from '../data/mockData';

export default function GroupsScreen({navigation}: any) {
  return (
    <ScrollView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Meus Grupos</Text>
        <TouchableOpacity style={s.createBtn} onPress={() => navigation.navigate('CreateGroup')}>
          <Text style={s.createBtnText}>+ Criar</Text>
        </TouchableOpacity>
      </View>
      {mockGroups.map(g => (
        <TouchableOpacity key={g.id} style={s.card} onPress={() => navigation.navigate('GroupDetail', {groupId: g.id})}>
          <View style={s.cardHeader}>
            <View style={[s.iconBox, g.type === 'challenge' ? s.iconChallenge : s.iconClub]}>
              <Text style={s.iconText}>{g.type === 'challenge' ? '⭐' : '👥'}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={s.cardTitle}>{g.name}</Text>
              <Text style={[s.badge, g.type === 'challenge' ? {color: '#F59E0B'} : {color: '#06B6D4'}]}>
                {g.type === 'challenge' ? 'Desafio' : 'Clube'}
              </Text>
            </View>
          </View>
          <Text style={s.desc}>{g.description}</Text>
          <View style={s.meta}>
            <Text style={s.metaText}>👥 {g.members} membros</Text>
            <Text style={s.metaText}>📝 {g.posts} posts</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.bgPrimary, padding: 16},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
  title: {fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary},
  createBtn: {backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12},
  createBtnText: {color: '#fff', fontWeight: '700', fontSize: 14},
  card: {backgroundColor: theme.colors.bgSecondary, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border},
  cardHeader: {flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 10},
  iconBox: {width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  iconChallenge: {backgroundColor: 'rgba(245,158,11,0.12)'},
  iconClub: {backgroundColor: 'rgba(6,182,212,0.12)'},
  iconText: {fontSize: 22},
  cardTitle: {fontSize: 17, fontWeight: '700', color: theme.colors.textPrimary},
  badge: {fontSize: 11, fontWeight: '700', marginTop: 2},
  desc: {fontSize: 13, color: theme.colors.textSecondary, marginBottom: 12},
  meta: {flexDirection: 'row', gap: 20},
  metaText: {fontSize: 12, color: theme.colors.textMuted},
});
