import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import {theme} from '../theme';
import {mockGroups, mockActivities, mockRankings} from '../data/mockData';

export default function GroupDetailScreen({route, navigation}: any) {
  const {groupId} = route.params;
  const group = mockGroups.find(g => g.id === groupId) || mockGroups[0];
  const [rankTab, setRankTab] = useState<'weekly' | 'monthly'>('weekly');
  const rankings = mockRankings[rankTab] || mockRankings.weekly;

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.bgPrimary}}>
      <ScrollView style={s.container}>
        <View style={s.headerRow}>
          <View style={{flex: 1}}>
            <Text style={s.title}>{group.name}</Text>
            <Text style={s.meta}>🔥 {group.members} membros • {group.posts} posts</Text>
          </View>
          <TouchableOpacity style={s.btnDetails} onPress={() => navigation.navigate('GroupInfo', {groupId})}>
            <Text style={s.btnDetailsText}>Detalhes</Text>
          </TouchableOpacity>
        </View>

      {/* Feed */}
      <Text style={s.section}>📰 Feed de Atividades</Text>
      {mockActivities.map(act => (
        <TouchableOpacity key={act.id} style={s.feedCard} onPress={() => navigation.navigate('PostDetail', {postId: act.id})}>
          <View style={s.feedHeader}>
            <Image source={{uri: act.userAvatar}} style={s.avatar} />
            <View>
              <Text style={s.feedName}>{act.userName}</Text>
              <Text style={s.feedTime}>{act.time}</Text>
            </View>
          </View>
          <Text style={s.feedContent}>{act.content}</Text>
          {act.photo && <Image source={{uri: act.photo}} style={s.feedPhoto} />}
          <View style={s.feedActions}>
            <Text style={s.actionText}>❤️ {act.likes}</Text>
            <Text style={s.actionText}>💬 2</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Ranking */}
      <Text style={s.section}>🏆 Classificação</Text>
      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, rankTab === 'weekly' && s.tabActive]} onPress={() => setRankTab('weekly')}>
          <Text style={[s.tabText, rankTab === 'weekly' && s.tabTextActive]}>Semana</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, rankTab === 'monthly' && s.tabActive]} onPress={() => setRankTab('monthly')}>
          <Text style={[s.tabText, rankTab === 'monthly' && s.tabTextActive]}>Mês</Text>
        </TouchableOpacity>
      </View>
      {rankings.map((u, i) => (
        <TouchableOpacity key={u.userId} style={s.rankItem} onPress={() => navigation.navigate('UserProfile', {userId: u.userId})}>
          <Text style={[s.rankPos, i === 0 && {color: '#FFD700'}, i === 1 && {color: '#C0C0C0'}, i === 2 && {color: '#CD7F32'}]}>{i + 1}</Text>
          <Image source={{uri: u.avatar}} style={s.rankAvatar} />
          <Text style={s.rankName}>{u.name}</Text>
          <Text style={s.rankScore}>{u.score} pts</Text>
        </TouchableOpacity>
      ))}

      <View style={{height: 100}} />
      </ScrollView>
      
      {/* FAB - Action Sheet Mock */}
      <TouchableOpacity 
        style={s.fab} 
        onPress={() => {
          Alert.alert(
            'Novo Treino',
            'Escolha como adicionar',
            [
              { text: 'Tirar Foto', onPress: () => navigation.navigate('NewCheckIn', {groupId, mode: 'camera'}) },
              { text: 'Procurar Imagem', onPress: () => navigation.navigate('NewCheckIn', {groupId, mode: 'gallery'}) },
              { text: 'Digitar Direto', onPress: () => navigation.navigate('NewCheckIn', {groupId, mode: 'form'}) },
              { text: 'Cancelar', style: 'cancel' }
            ]
          );
        }}
        activeOpacity={0.8}
      >
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.bgPrimary, padding: 16},
  title: {fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4},
  meta: {fontSize: 14, color: theme.colors.textMuted, marginBottom: 24},
  section: {fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 14, marginTop: 8},
  feedCard: {backgroundColor: theme.colors.bgSecondary, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border},
  feedHeader: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10},
  avatar: {width: 36, height: 36, borderRadius: 18},
  feedName: {fontWeight: '700', color: theme.colors.textPrimary, fontSize: 14},
  feedTime: {fontSize: 11, color: theme.colors.textMuted},
  feedContent: {fontSize: 14, color: theme.colors.textPrimary, marginBottom: 10, lineHeight: 20},
  feedPhoto: {width: '100%', height: 200, borderRadius: 12, marginBottom: 10},
  feedActions: {flexDirection: 'row', gap: 20},
  actionText: {fontSize: 13, color: theme.colors.textMuted},
  tabs: {flexDirection: 'row', gap: 8, marginBottom: 14},
  tab: {paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border},
  tabActive: {backgroundColor: 'rgba(124,58,237,0.15)', borderColor: theme.colors.primary},
  tabText: {fontSize: 13, color: theme.colors.textMuted},
  tabTextActive: {color: theme.colors.primaryLight},
  rankItem: {flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'},
  rankPos: {width: 22, fontWeight: '700', fontSize: 14, color: theme.colors.textMuted},
  rankAvatar: {width: 32, height: 32, borderRadius: 16, marginRight: 10},
  rankName: {flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary},
  rankScore: {fontSize: 14, fontWeight: '700', color: theme.colors.primary},
  headerRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
  btnDetails: {backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'},
  btnDetailsText: {color: '#fff', fontSize: 13, fontWeight: '600'},
  fab: {position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5},
  fabText: {color: '#fff', fontSize: 32, fontWeight: '300', marginTop: -4},
});
