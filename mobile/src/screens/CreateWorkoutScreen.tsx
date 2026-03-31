import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../theme';
import api from '../services/api';
import {useNetwork} from '../contexts/NetworkContext';
import {
  addWorkoutToCache,
  addToQueue,
  generateTempId,
} from '../services/offlineStorage';
import type {Workout} from '../services/api';

interface ExerciseInput {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function CreateWorkoutScreen() {
  const navigation = useNavigation();
  const {isOnline} = useNetwork();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState<ExerciseInput[]>([
    {name: '', sets: '3', reps: '10', weight: '0'},
  ]);

  const addExercise = () => {
    setExercises([...exercises, {name: '', sets: '3', reps: '10', weight: '0'}]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index: number, field: keyof ExerciseInput, value: string) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título do treino é obrigatório.');
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício com nome.');
      return;
    }

    const workoutData = {
      title: title.trim(),
      description: description.trim() || undefined,
      duration: duration ? parseInt(duration) : undefined,
      exercises: validExercises.map(ex => ({
        name: ex.name.trim(),
        sets: parseInt(ex.sets) || 0,
        reps: parseInt(ex.reps) || 0,
        weight: parseFloat(ex.weight) || 0,
      })),
    };

    setLoading(true);
    try {
      if (isOnline) {
        await api.post('/workouts', workoutData);
      } else {
        // Save locally with a temporary ID
        const tempId = generateTempId();
        const offlineWorkout: Workout = {
          id: tempId,
          title: workoutData.title,
          description: workoutData.description || null,
          status: 'planned',
          duration: workoutData.duration || null,
          userId: '',
          exercises: workoutData.exercises.map((ex, i) => ({
            id: `${tempId}_ex_${i}`,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            workoutId: tempId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await addWorkoutToCache(offlineWorkout);
        await addToQueue({
          id: tempId,
          type: 'CREATE',
          data: workoutData,
          timestamp: Date.now(),
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar treino. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineBannerText}>📡 Modo offline — treino será sincronizado ao reconectar</Text>
          </View>
        )}

        <Text style={styles.label}>TÍTULO DO TREINO</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Treino de Peito"
          placeholderTextColor={theme.colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>DESCRIÇÃO (OPCIONAL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Foco em hipertrofia"
          placeholderTextColor={theme.colors.textMuted}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>DURAÇÃO (MINUTOS)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 60"
          placeholderTextColor={theme.colors.textMuted}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>EXERCÍCIOS</Text>
        </View>

        {exercises.map((ex, i) => (
          <View key={i} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseNumber}>#{i + 1}</Text>
              <TouchableOpacity onPress={() => removeExercise(i)}>
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.exerciseInput}
              placeholder="Nome do exercício"
              placeholderTextColor={theme.colors.textMuted}
              value={ex.name}
              onChangeText={val => updateExercise(i, 'name', val)}
            />

            <View style={styles.exerciseGrid}>
              <View style={{flex: 1}}>
                <Text style={styles.gridLabel}>SÉRIES</Text>
                <TextInput
                  style={styles.gridInput}
                  value={ex.sets}
                  onChangeText={val => updateExercise(i, 'sets', val)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.gridLabel}>REPS</Text>
                <TextInput
                  style={styles.gridInput}
                  value={ex.reps}
                  onChangeText={val => updateExercise(i, 'reps', val)}
                  keyboardType="numeric"
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.gridLabel}>PESO (KG)</Text>
                <TextInput
                  style={styles.gridInput}
                  value={ex.weight}
                  onChangeText={val => updateExercise(i, 'weight', val)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addExercise}>
          <Text style={styles.addBtnText}>+ Adicionar Exercício</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.btnDisabled]}
          onPress={handleSave}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar Treino</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 50,
  },
  offlineBanner: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    marginBottom: 12,
  },
  offlineBannerText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 8,
    marginTop: 16,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.colors.bgInput,
    borderRadius: theme.radius.md,
    padding: 12,
    color: theme.colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primaryLight,
    letterSpacing: 1.5,
  },
  exerciseCard: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    color: theme.colors.primaryLight,
    fontWeight: '700',
    fontSize: 14,
  },
  removeText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseInput: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 8,
    color: theme.colors.textPrimary,
    fontSize: 16,
    marginBottom: 16,
  },
  exerciseGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  gridLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginBottom: 4,
    fontWeight: '600',
  },
  gridInput: {
    backgroundColor: theme.colors.bgInput,
    borderRadius: theme.radius.sm,
    padding: 8,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontSize: 14,
  },
  addBtn: {
    padding: 16,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 24,
  },
  addBtnText: {
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    padding: 18,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.7,
  },
});
