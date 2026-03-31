import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import api, { Workout } from '../services/api';
import { useNetwork } from '../contexts/NetworkContext';
import { getCachedWorkouts } from '../services/offlineStorage';
import { getUserProfile } from '../data/mockData';

const genderLabel: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
  other: 'Outro',
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) { return '-'; }
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

const calcAge = (dateStr?: string | null) => {
  if (!dateStr) { return '-'; }
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) { age--; }
  return `${age} anos`;
};

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout, refreshUser } = useAuth();
  const { isOnline } = useNetwork();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        if (isOnline) {
          const res = await api.get<Workout[]>('/workouts');
          setWorkouts(res.data);
        } else {
          const cached = await getCachedWorkouts();
          setWorkouts(cached);
        }
      } catch {
        const cached = await getCachedWorkouts();
        setWorkouts(cached);
      } finally {
        setLoadingStats(false);
      }
    };
    loadWorkouts();
  }, [isOnline]);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const completed = workouts.filter(w => w.status === 'completed');
  const totalDuration = completed.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalHours = Math.floor(totalDuration / 60);

  const mockUser = getUserProfile(user.id);
  const calendarDays = [];
  for (let i = 1; i <= 31; i++) {
    const dateStr = `2026-03-${String(i).padStart(2, '0')}`;
    const dayData = mockUser.history[dateStr];
    calendarDays.push({day: i, data: dayData});
  }

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [weight, setWeight] = useState(user.weight?.toString() || '');
  const [height, setHeight] = useState(user.height?.toString() || '');

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleSaveWithRefresh = async () => {
    setSaving(true);
    try {
      await api.patch('/users/me', {
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
      });
      await refreshUser();
      setEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar Card */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarLetter}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.avatarInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>
            Membro desde {formatDate(user.createdAt)}
          </Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Conquistas</Text>
        <View style={styles.achievementRow}>
          <View style={styles.achievementCard}>
            <Text style={styles.achIcon}>🏋️</Text>
            <Text style={styles.achValue}>{loadingStats ? '-' : workouts.length}</Text>
            <Text style={styles.achLabel}>TREINOS</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achIcon}>✅</Text>
            <Text style={styles.achValue}>
              {loadingStats ? '-' : completed.length}
            </Text>
            <Text style={styles.achLabel}>CONCLUÍDOS</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achIcon}>⏱️</Text>
            <Text style={styles.achValue}>{loadingStats ? '-' : totalHours}h</Text>
            <Text style={styles.achLabel}>TREINO TOTAL</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Calendário de Treinos</Text>
        <View style={styles.calGrid}>
          {calendarDays.map(({day, data}) => (
            <View key={day} style={[styles.calCell, data && styles.calCellActive]}>
              {data?.photo ? (
                <Image source={{uri: data.photo}} style={styles.calPhoto} />
              ) : data ? (
                <Text style={styles.calCheck}>✓</Text>
              ) : (
                <Text style={styles.calDay}>{day}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Personal Data */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👤 Dados Pessoais</Text>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editBtn}>✏️ Editar</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.dataGrid}>
          <View style={styles.dataField}>
            <Text style={styles.dataLabel}>PESO (KG)</Text>
            {editing ? (
              <TextInput
                style={styles.dataInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="Ex: 80"
                placeholderTextColor={theme.colors.textMuted}
              />
            ) : (
              <Text style={styles.dataValue}>
                {user.weight ? `${user.weight} kg` : '-'}
              </Text>
            )}
          </View>
          <View style={styles.dataField}>
            <Text style={styles.dataLabel}>ALTURA (CM)</Text>
            {editing ? (
              <TextInput
                style={styles.dataInput}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="Ex: 180"
                placeholderTextColor={theme.colors.textMuted}
              />
            ) : (
              <Text style={styles.dataValue}>
                {user.height ? `${user.height} cm` : '-'}
              </Text>
            )}
          </View>
          <View style={styles.dataField}>
            <Text style={styles.dataLabel}>IDADE</Text>
            <Text style={styles.dataValue}>{calcAge(user.dateOfBirth)}</Text>
          </View>
          <View style={styles.dataField}>
            <Text style={styles.dataLabel}>GÊNERO</Text>
            <Text style={styles.dataValue}>
              {user.gender ? genderLabel[user.gender] || user.gender : '-'}
            </Text>
          </View>
        </View>

        {editing && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.7 }]}
              onPress={handleSaveWithRefresh}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Salvar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setEditing(false);
                setWeight(user.weight?.toString() || '');
                setHeight(user.height?.toString() || '');
              }}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgPrimary,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    gap: 16,
    borderTopWidth: 3,
    borderTopColor: theme.colors.primary,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  avatarInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  userEmail: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  memberSince: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: 4,
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
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  editBtn: {
    fontSize: 13,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  dataInput: {
    backgroundColor: theme.colors.bgInput,
    borderRadius: theme.radius.sm,
    padding: 8,
    color: theme.colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  achievementRow: {
    flexDirection: 'row',
    gap: 10,
  },
  achievementCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  achIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  achValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  achLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataField: {
    width: '47%',
  },
  dataLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    borderRadius: theme.radius.md,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#F87171',
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
  calGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 12},
  calCell: {width: '13%', aspectRatio: 1, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden'},
  calCellActive: {borderColor: 'rgba(124,58,237,0.3)'},
  calDay: {fontSize: 12, color: theme.colors.textMuted},
  calCheck: {fontSize: 14, color: theme.colors.primary, fontWeight: '700'},
  calPhoto: {width: '100%', height: '100%'},
});
