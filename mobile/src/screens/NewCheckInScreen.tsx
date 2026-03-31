import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import {theme} from '../theme';

export default function NewCheckInScreen({route, navigation}: any) {
  const {groupId, mode} = route.params || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');

  // Mocked image state
  const mockImage = mode === 'camera' || mode === 'gallery' ? 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' : null;

  const handlePublish = () => {
    if (!title) {
        Alert.alert('O título é obrigatório.');
        return;
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{paddingTop: 16, paddingBottom: 40}}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.headerBtn}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Novo check-in</Text>
        <TouchableOpacity onPress={handlePublish} style={s.publishBtn}>
          <Text style={s.publishText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <TextInput 
          style={s.input} 
          placeholder="Título do treino*" 
          placeholderTextColor={theme.colors.textMuted}
          value={title} 
          onChangeText={setTitle} 
        />
        <TextInput 
          style={[s.input, {height: 80, textAlignVertical: 'top'}]} 
          placeholder="Descrição (opcional)" 
          placeholderTextColor={theme.colors.textMuted}
          value={description} 
          onChangeText={setDescription} 
          multiline 
        />

        <View style={s.gridRow}>
          <View style={s.gridItem}>
            <Text style={s.label}>Dia</Text>
            <TextInput style={s.input} value={date} onChangeText={setDate} />
          </View>
          <View style={s.gridItem}>
            <Text style={s.label}>Hora</Text>
            <TextInput style={s.input} value={time} onChangeText={setTime} />
          </View>
        </View>

        <View style={s.gridRow}>
          <View style={s.gridItem}>
            <Text style={s.label}>Duração (min)</Text>
            <TextInput style={s.input} placeholder="45" placeholderTextColor={theme.colors.textMuted} value={duration} onChangeText={setDuration} keyboardType="numeric" />
          </View>
          <View style={s.gridItem}>
            <Text style={s.label}>Distância (km) - Opcional</Text>
            <TextInput style={s.input} placeholder="5" placeholderTextColor={theme.colors.textMuted} value={distance} onChangeText={setDistance} keyboardType="numeric" />
          </View>
        </View>

        <View style={s.gridRow}>
          <View style={s.gridItemFull}>
            <Text style={s.label}>Calorias (kcal) - Opcional</Text>
            <TextInput style={s.input} placeholder="300" placeholderTextColor={theme.colors.textMuted} value={calories} onChangeText={setCalories} keyboardType="numeric" />
          </View>
        </View>

        <Text style={s.label}>Foto</Text>
        {mockImage ? (
          <Image source={{uri: mockImage}} style={s.previewImage} />
        ) : (
          <TouchableOpacity style={s.uploadBtn} onPress={() => Alert.alert('Simulando upload de imagem')}>
            <Text style={s.uploadText}>+ Adicionar Foto</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.bgPrimary, paddingHorizontal: 16},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
  headerBtn: {color: theme.colors.textMuted, fontSize: 15},
  headerTitle: {color: theme.colors.textPrimary, fontSize: 18, fontWeight: '700'},
  publishBtn: {backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8},
  publishText: {color: '#fff', fontWeight: 'bold'},
  card: {backgroundColor: theme.colors.bgSecondary, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border},
  input: {backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, color: theme.colors.textPrimary, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border},
  label: {color: theme.colors.textMuted, fontSize: 12, marginBottom: 6, fontWeight: '600'},
  gridRow: {flexDirection: 'row', gap: 12},
  gridItem: {flex: 1},
  gridItemFull: {flex: 1},
  previewImage: {width: '100%', height: 200, borderRadius: 12, marginTop: 8},
  uploadBtn: {padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed', marginTop: 8},
  uploadText: {color: theme.colors.textMuted}
});
