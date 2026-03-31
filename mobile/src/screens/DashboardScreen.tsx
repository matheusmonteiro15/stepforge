import React, {useState, useCallback} from 'react';
import {View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {theme} from '../theme';
import {useAuth} from '../contexts/AuthContext';
import api, {Workout} from '../services/api';
import {useNetwork} from '../contexts/NetworkContext';
import {getCachedWorkouts, saveCachedWorkouts} from '../services/offlineStorage';

const statusIcons: Record<string, string> = {
  completed: '✅',
  in_progress: '🏋️',
  planned: '📋',
  cancelled: '❌',
};

export default function DashboardScreen() {
  const {user} = useAuth();
  const {isOnline} = useNetwork();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkouts = async () => {
    try {
      if (isOnline) {
        const response = await api.get<Workout[]>('/workouts');
        const data = response.data || [];
        setWorkouts(data);
        await saveCachedWorkouts(data);
      } else {
        const cached = await getCachedWorkouts();
        setWorkouts(cached);
      }
    } catch (error) {
      // Fallback to cache
      const cached = await getCachedWorkouts();
      setWorkouts(cached);
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

  const recentWorkouts = workouts.slice(0, 4);
  const completedWorkouts = workouts.filter(w => w.status === 'completed');
  const totalDuration = completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const avgDuration = completedWorkouts.length > 0 ? Math.round(totalDuration / completedWorkouts.length) : 0;
  
  const totalExercises = workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);

  // Calculate current streak from real data
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    
    // Get unique dates of completed workouts, sorted descending
    const completedDates = workouts
      .filter(w => w.status === 'completed')
      .map(w => new Date(w.createdAt).toDateString());
    
    const uniqueDates = Array.from(new Set(completedDates))
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime());

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestWorkoutDate = uniqueDates[0];
    latestWorkoutDate.setHours(0, 0, 0, 0);

    // If latest workout was not today or yesterday, streak is broken
    const diffTime = today.getTime() - latestWorkoutDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0;

    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const current = uniqueDates[i-1];
      const prev = uniqueDates[i];
      const dayDiff = (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Calculate weekly activity from real data
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date();
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dayWorkouts = workouts.filter(w => {
      const wDate = new Date(w.createdAt);
      return wDate.toDateString() === d.toDateString() && w.status === 'completed';
    });
    const minutes = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    return { day: dayNames[d.getDay()], minutes };
  });

  const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 1);
  
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
    >
      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineBannerText}>📡 Modo offline — dados salvos localmente</Text>
        </View>
      )}

      {/* Header */}
      <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0] || 'Atleta'}! 👋</Text>
      <Text style={styles.subGreeting}>Confira seu progresso e continue evoluindo.</Text>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, {borderTopColor: theme.colors.primary}]}>
          <Text style={styles.statIcon}>🏋️</Text>
          <Text style={styles.statValue}>{workouts.length}</Text>
          <Text style={styles.statLabel}>Treinos totais</Text>
        </View>
        <View style={[styles.statCard, {borderTopColor: theme.colors.success}]}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>{completedWorkouts.length}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
        <View style={[styles.statCard, {borderTopColor: theme.colors.warning}]}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statValue}>{avgDuration}min</Text>
          <Text style={styles.statLabel}>Média/treino</Text>
        </View>
        <View style={[styles.statCard, {borderTopColor: theme.colors.error}]}>
          <Text style={styles.statIcon}>💪</Text>
          <Text style={styles.statValue}>{totalExercises}</Text>
          <Text style={styles.statLabel}>Exercícios</Text>
        </View>
      </View>

      {/* Weekly Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Atividade Semanal</Text>
        <View style={styles.chartRow}>
          {weeklyActivity.map(day => (
            <View key={day.day} style={styles.chartBarGroup}>
              <View style={styles.chartBarContainer}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${day.minutes > 0 ? (day.minutes / maxMinutes) * 100 : 4}%`,
                      opacity: day.minutes > 0 ? 1 : 0.2,
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartLabel}>{day.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🕐 Treinos Recentes</Text>
        {recentWorkouts.length === 0 ? (
          <Text style={{color: theme.colors.textMuted, textAlign: 'center', paddingVertical: 20}}>
            Nenhum treino registrado ainda. Crie seu primeiro treino! 💪
          </Text>
        ) : (
          recentWorkouts.map(w => (
            <View key={w.id} style={styles.workoutItem}>
              <View
                style={[
                  styles.workoutIcon,
                  {
                    backgroundColor:
                      w.status === 'completed'
                        ? 'rgba(16,185,129,0.15)'
                        : w.status === 'in_progress'
                        ? 'rgba(245,158,11,0.15)'
                        : 'rgba(124,58,237,0.15)',
                  },
                ]}>
                <Text style={{fontSize: 18}}>{statusIcons[w.status] || '📋'}</Text>
              </View>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTitle} numberOfLines={1}>{w.title}</Text>
                <Text style={styles.workoutSub}>{w.exercises?.length || 0} exercícios</Text>
              </View>
              <View style={styles.workoutMeta}>
                {w.duration ? (
                  <Text style={styles.workoutDuration}>{w.duration}min</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  greeting: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
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
  subGreeting: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 3,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    gap: 8,
  },
  chartBarGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  chartBarContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBar: {
    width: '70%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12,
  },
  workoutIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  workoutSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  workoutMeta: {
    alignItems: 'flex-end',
  },
  workoutDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  workoutCal: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
});
