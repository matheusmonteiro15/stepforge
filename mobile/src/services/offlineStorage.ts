import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Workout} from './api';

const WORKOUTS_KEY = '@sf_workouts';
const QUEUE_KEY = '@sf_offline_queue';

// ========== Offline Operation Types ==========
export type OfflineOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface OfflineOperation {
  id: string;
  type: OfflineOperationType;
  data: any;
  timestamp: number;
}

// ========== Cached Workouts ==========

export async function getCachedWorkouts(): Promise<Workout[]> {
  try {
    const raw = await AsyncStorage.getItem(WORKOUTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveCachedWorkouts(workouts: Workout[]): Promise<void> {
  await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

// ========== Offline Queue ==========

export async function getQueue(): Promise<OfflineOperation[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addToQueue(operation: OfflineOperation): Promise<void> {
  const queue = await getQueue();
  queue.push(operation);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY);
}

export async function hasQueuedOperations(): Promise<boolean> {
  const queue = await getQueue();
  return queue.length > 0;
}

// ========== Helper: Generate Temp ID ==========

export function generateTempId(): string {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

// ========== Local Workout Manipulation ==========

export async function addWorkoutToCache(workout: Workout): Promise<void> {
  const workouts = await getCachedWorkouts();
  workouts.unshift(workout); // newest first
  await saveCachedWorkouts(workouts);
}

export async function updateWorkoutInCache(
  id: string,
  updates: Partial<Workout>,
): Promise<void> {
  const workouts = await getCachedWorkouts();
  const index = workouts.findIndex(w => w.id === id);
  if (index !== -1) {
    workouts[index] = {...workouts[index], ...updates};
    await saveCachedWorkouts(workouts);
  }
}

export async function removeWorkoutFromCache(id: string): Promise<void> {
  const workouts = await getCachedWorkouts();
  const filtered = workouts.filter(w => w.id !== id);
  await saveCachedWorkouts(filtered);
}
