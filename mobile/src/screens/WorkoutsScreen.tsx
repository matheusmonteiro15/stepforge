import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {theme} from '../theme';
import api, {type Workout} from '../services/api';
import {Alert} from 'react-native';
import {useNetwork} from '../contexts/NetworkContext';
import {
  getCachedWorkouts,
  saveCachedWorkouts,
  updateWorkoutInCache,
  removeWorkoutFromCache,
  addToQueue,
  generateTempId,
} from '../services/offlineStorage';

const statusLabels: Record<string, string> = {
  all: 'Todos',
  planned: 'Planejado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
};

const statusDisplay: Record<string, string> = {
  completed: 'Concluído',
  in_progress: 'Em andamento',
  planned: 'Planejado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, {bg: string; text: string}> = {
  completed: {bg: 'rgba(16,185,129,0.15)', text: '#34D399'},
  in_progress: {bg: 'rgba(245,158,11,0.15)', text: '#FBBF24'},
  planned: {bg: 'rgba(124,58,237,0.15)', text: '#A78BFA'},
  cancelled: {bg: 'rgba(239,68,68,0.15)', text: '#F87171'},
};

const formatExerciseDetail = (ex: Workout['exercises'][0]) => {
  const parts: string[] = [];
  if (ex.sets && ex.reps) {parts.push(`${ex.sets}×${ex.reps}`);}
  if (ex.weight) {parts.push(`${ex.weight}kg`);}
  return parts.join(' · ') || '-';
};

export default function WorkoutsScreen() {
  const [filter, setFilter] = useState<string>('all');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const {isOnline} = useNetwork();

  const loadWorkouts = async () => {
    try {
      if (isOnline) {
        const response = await api.get<Workout[]>('/workouts');
        const sorted = (response.data || []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setWorkouts(sorted);
        await saveCachedWorkouts(sorted);
      } else {
        const cached = await getCachedWorkouts();
        const sorted = cached.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setWorkouts(sorted);
      }
    } catch (error) {
      // API failed — fall back to cache
      const cached = await getCachedWorkouts();
      setWorkouts(cached.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [isOnline])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadWorkouts();
  };

  const filteredWorkouts =
    filter === 'all'
      ? workouts
      : workouts.filter(w => w.status === filter);

  const handleToggleStatus = async (workout: Workout) => {
    const nextStatus = 
      workout.status === 'planned' ? 'in_progress' : 
      workout.status === 'in_progress' ? 'completed' : 
      'planned';
    
    // Optimistically update local state and cache
    const updatedWorkouts = workouts.map(w =>
      w.id === workout.id ? {...w, status: nextStatus as Workout['status']} : w
    );
    setWorkouts(updatedWorkouts);
    await updateWorkoutInCache(workout.id, {status: nextStatus as Workout['status']});

    if (isOnline) {
      try {
        await api.patch(`/workouts/${workout.id}`, {status: nextStatus});
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o status do treino.');
        loadWorkouts(); // revert
      }
    } else {
      await addToQueue({
        id: generateTempId(),
        type: 'UPDATE',
        data: {workoutId: workout.id, updates: {status: nextStatus}},
        timestamp: Date.now(),
      });
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Excluir Treino',
      'Tem certeza que deseja excluir este treino?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            // Optimistically remove from local state and cache
            setWorkouts(prev => prev.filter(w => w.id !== id));
            await removeWorkoutFromCache(id);

            if (isOnline) {
              try {
                await api.delete(`/workouts/${id}`);
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível excluir o treino.');
                loadWorkouts(); // revert
              }
            } else {
              await addToQueue({
                id: generateTempId(),
                type: 'DELETE',
                data: {workoutId: id},
                timestamp: Date.now(),
              });
            }
          }
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>📡 Modo offline — alterações serão sincronizadas ao reconectar</Text>
        </View>
      )}

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersContainer}>
        {(['all', 'planned', 'in_progress', 'completed'] as const).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.filterBtn, filter === s && styles.filterBtnActive]}
            onPress={() => setFilter(s)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterText,
                filter === s && styles.filterTextActive,
              ]}>
              {statusLabels[s]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Workouts List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }>
        {filteredWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyText}>Nenhum treino com esse filtro.</Text>
          </View>
        ) : (
          filteredWorkouts.map(w => {
            const sc = statusColors[w.status] || statusColors.planned;
            const isOfflineItem = w.id.startsWith('offline_');
            return (
              <View key={w.id} style={[styles.card, isOfflineItem && styles.offlineCard]}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={{flex: 1}}>
                    <Text style={styles.cardTitle}>
                      {w.title}
                      {isOfflineItem ? ' 📱' : ''}
                    </Text>
                    {w.description ? (
                      <Text style={styles.cardDesc}>{w.description}</Text>
                    ) : null}
                  </View>
                  <View style={[styles.badge, {backgroundColor: sc.bg}]}>
                    <Text style={[styles.badgeText, {color: sc.text}]}>
                      {statusDisplay[w.status]}
                    </Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={styles.cardStats}>
                  {w.duration ? <Text style={styles.cardStat}>⏱️ {w.duration}min</Text> : null}
                  <Text style={styles.cardStat}>💪 {w.exercises.length} ex.</Text>
                </View>

                {/* Exercises */}
                <View style={styles.exercisesSection}>
                  <Text style={styles.exercisesTitle}>EXERCÍCIOS</Text>
                  {w.exercises.slice(0, 4).map((ex, idx) => (
                    <View key={ex.id || `ex-${idx}`} style={styles.exerciseRow}>
                      <Text style={styles.exerciseName} numberOfLines={1}>{ex.name}</Text>
                      <Text style={styles.exerciseDetail}>
                        {formatExerciseDetail(ex)}
                      </Text>
                    </View>
                  ))}
                  {w.exercises.length > 4 && (
                    <Text style={styles.moreText}>
                      +{w.exercises.length - 4} mais...
                    </Text>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.statusBtn]}
                    onPress={() => handleToggleStatus(w)}
                    activeOpacity={0.7}>
                    <Text style={styles.statusBtnText}>
                      {w.status === 'planned' ? '▶️ Iniciar' : w.status === 'in_progress' ? '✅ Concluir' : '🔄 Reabrir'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(w.id)}
                    activeOpacity={0.7}>
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateWorkout')}
        activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  offlineBanner: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,158,11,0.3)',
  },
  offlineBannerText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  offlineCard: {
    borderColor: 'rgba(245,158,11,0.3)',
    borderStyle: 'dashed',
  },
  filtersContainer: {
    maxHeight: 56,
    paddingTop: theme.spacing.md,
  },
  filtersRow: {
    paddingHorizontal: theme.spacing.md,
    gap: 8,
    flexDirection: 'row',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.bgCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    gap: 12,
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cardDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  cardStat: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  exercisesSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  exercisesTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  exerciseName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  exerciseDetail: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  moreText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    height: 40,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  statusBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusBtnText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 44,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.2)',
  },
  deleteBtnText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    marginTop: -2,
  },
});
