import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Android Emulator, localhost is mapped to 10.0.2.2
// Use local machine IP for physical devices: 192.168.0.16
// Note: If connection fails, check Windows Firewall for port 3000.
const API_BASE = 'http://192.168.0.16:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('@sf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// ========== Types ==========
export interface User {
  id: string;
  name: string;
  email: string;
  weight?: number | null;
  height?: number | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
  workoutId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  title: string;
  description?: string | null;
  status: 'planned' | 'in_progress' | 'completed';
  duration?: number | null;
  userId: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseInput {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface CreateWorkoutInput {
  title: string;
  description?: string;
  status?: string;
  duration?: number;
  exercises: CreateExerciseInput[];
}

export interface UpdateWorkoutInput {
  title?: string;
  description?: string;
  status?: string;
  duration?: number;
}

// ========== Workouts API ==========
export async function getWorkouts(): Promise<Workout[]> {
  const response = await api.get<Workout[]>('/workouts');
  return response.data;
}

export async function getWorkout(id: string): Promise<Workout> {
  const response = await api.get<Workout>(`/workouts/${id}`);
  return response.data;
}

export async function createWorkout(
  data: CreateWorkoutInput,
): Promise<Workout> {
  const response = await api.post<Workout>('/workouts', data);
  return response.data;
}

export async function updateWorkout(
  id: string,
  data: UpdateWorkoutInput,
): Promise<Workout> {
  const response = await api.patch<Workout>(`/workouts/${id}`, data);
  return response.data;
}

export async function deleteWorkout(id: string): Promise<void> {
  await api.delete(`/workouts/${id}`);
}

// ========== Users API ==========
export async function getProfile(): Promise<User> {
  const response = await api.get<User>('/users/me');
  return response.data;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
}

export default api;
