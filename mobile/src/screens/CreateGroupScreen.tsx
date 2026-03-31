import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {theme} from '../theme';
import {mockGroups, GroupType} from '../data/mockData';

export default function CreateGroupScreen({navigation}: any) {
  const [groupType, setGroupType] = useState<GroupType>('challenge');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    mockGroups.push({id: `g${mockGroups.length + 1}`, name: name.trim(), type: groupType, members: 1, posts: 0, description: desc.trim()});
    navigation.navigate('Grupos');
  };

  return (
    <ScrollView style={s.container}>
      <Text style={s.title}>Criar Novo Grupo 🚀</Text>
      <Text style={s.subtitle}>Escolha o tipo e dê um nome.</Text>

      <Text style={s.label}>Tipo de Grupo</Text>
      <View style={s.typeRow}>
        <TouchableOpacity style={[s.typeCard, groupType === 'challenge' && s.typeSelected]} onPress={() => setGroupType('challenge')}>
          <Text style={s.typeIcon}>⭐</Text>
          <Text style={s.typeTitle}>Desafio</Text>
          <Text style={s.typeDesc}>Metas de curto prazo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.typeCard, groupType === 'club' && s.typeSelectedClub]} onPress={() => setGroupType('club')}>
          <Text style={s.typeIcon}>👥</Text>
          <Text style={s.typeTitle}>Clube</Text>
          <Text style={s.typeDesc}>Comunidade contínua</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.label}>Detalhes</Text>
      <TextInput style={s.input} placeholder="Nome do Grupo" placeholderTextColor={theme.colors.textMuted} value={name} onChangeText={setName} />
      <TextInput style={[s.input, {height: 80, textAlignVertical: 'top'}]} placeholder="Descrição (opcional)" placeholderTextColor={theme.colors.textMuted} value={desc} onChangeText={setDesc} multiline />

      <TouchableOpacity style={s.createBtn} onPress={handleCreate}>
        <Text style={s.createBtnText}>Criar Grupo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.bgPrimary, padding: 16},
  title: {fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 4},
  subtitle: {fontSize: 14, color: theme.colors.textMuted, marginBottom: 28},
  label: {fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 12},
  typeRow: {flexDirection: 'row', gap: 16, marginBottom: 28},
  typeCard: {flex: 1, backgroundColor: theme.colors.bgSecondary, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: theme.colors.border},
  typeSelected: {borderColor: theme.colors.primary},
  typeSelectedClub: {borderColor: theme.colors.accent},
  typeIcon: {fontSize: 32, marginBottom: 8},
  typeTitle: {fontSize: 17, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4},
  typeDesc: {fontSize: 12, color: theme.colors.textMuted, textAlign: 'center'},
  input: {backgroundColor: theme.colors.bgSecondary, borderRadius: 12, padding: 14, color: theme.colors.textPrimary, fontSize: 14, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 12},
  createBtn: {backgroundColor: theme.colors.primary, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8},
  createBtnText: {color: '#fff', fontWeight: '700', fontSize: 15},
});
