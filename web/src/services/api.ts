const API_BASE = '/api';

// ========== Token Management ==========
function getToken(): string | null {
  return localStorage.getItem('sf_token');
}

function setToken(token: string): void {
  localStorage.setItem('sf_token', token);
}

function clearToken(): void {
  localStorage.removeItem('sf_token');
  localStorage.removeItem('sf_user');
}

// ========== Fetch Wrapper ==========
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed: ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

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

// ========== Auth API ==========
export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.accessToken);
  localStorage.setItem('sf_user', JSON.stringify(data.user));
  return data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.accessToken);
  localStorage.setItem('sf_user', JSON.stringify(data.user));
  return data;
}

export function logout(): void {
  clearToken();
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem('sf_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

// ========== Users API ==========
export async function getProfile(): Promise<User> {
  return apiFetch<User>('/users/me');
}

export async function getUser(id: string): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const updated = await apiFetch<User>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  localStorage.setItem('sf_user', JSON.stringify(updated));
  return updated;
}

// ========== Workouts API ==========
export async function getWorkouts(): Promise<Workout[]> {
  return apiFetch<Workout[]>('/workouts');
}

export async function getWorkout(id: string): Promise<Workout> {
  return apiFetch<Workout>(`/workouts/${id}`);
}

export async function createWorkout(data: CreateWorkoutInput): Promise<Workout> {
  return apiFetch<Workout>('/workouts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateWorkout(id: string, data: UpdateWorkoutInput): Promise<Workout> {
  return apiFetch<Workout>(`/workouts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteWorkout(id: string): Promise<void> {
  await apiFetch<void>(`/workouts/${id}`, {
    method: 'DELETE',
  });
}

// ========== Groups API ==========
export interface Group {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  image?: string;
  ownerId?: string;
  createdAt?: string;
}

export async function getGroups(): Promise<Group[]> {
  return apiFetch<Group[]>('/groups');
}

export async function getGroup(id: string): Promise<Group> {
  return apiFetch<Group>(`/groups/${id}`);
}

export async function createGroup(data: Partial<Group>): Promise<Group> {
  return apiFetch<Group>('/groups', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteGroup(id: string): Promise<void> {
  await apiFetch<void>(`/groups/${id}`, {
    method: 'DELETE',
  });
}

// ========== Activities API ==========
export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  photo?: string;
  likes: number;
  groupId?: string;
  time?: string; // Add optional time to avoid compile errors with mock format
  createdAt?: string;
}

export async function getActivities(groupId?: string): Promise<Activity[]> {
  const query = groupId ? `?groupId=${groupId}` : '';
  return apiFetch<Activity[]>(`/activities${query}`);
}

export async function getActivity(id: string): Promise<Activity> {
  return apiFetch<Activity>(`/activities/${id}`);
}

export async function createActivity(data: Partial<Activity>): Promise<Activity> {
  return apiFetch<Activity>('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
