export interface User {
  id: string;
  name: string;
  email: string;
  weight?: number;
  height?: number;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
}

export type WorkoutStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  order: number;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  duration: number;
  caloriesBurned?: number;
  exercises: Exercise[];
  status: WorkoutStatus;
  completedAt?: string;
  createdAt: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCaloriesBurned: number;
  averageWorkoutDuration: number;
  currentStreak: number;
}

export const mockUser: User = {
  id: '1',
  name: 'Matheus Silva',
  email: 'matheus@email.com',
  weight: 78,
  height: 175,
  dateOfBirth: '1998-05-14',
  gender: 'male',
  createdAt: '2025-01-15',
};

export const mockStats: WorkoutStats = {
  totalWorkouts: 47,
  totalDuration: 2820,
  totalCaloriesBurned: 18400,
  averageWorkoutDuration: 60,
  currentStreak: 5,
};

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Treino de Peito & Tríceps',
    description: 'Foco em supino e extensões',
    duration: 65,
    caloriesBurned: 420,
    status: 'completed',
    completedAt: '2026-03-14T18:30:00',
    createdAt: '2026-03-14T17:25:00',
    exercises: [
      {id: 'e1', name: 'Supino Reto', sets: 4, reps: 10, weight: 60, order: 1},
      {id: 'e2', name: 'Supino Inclinado', sets: 3, reps: 12, weight: 50, order: 2},
      {id: 'e3', name: 'Crucifixo', sets: 3, reps: 15, weight: 16, order: 3},
      {id: 'e4', name: 'Tríceps Corda', sets: 3, reps: 12, weight: 25, order: 4},
      {id: 'e5', name: 'Tríceps Francês', sets: 3, reps: 10, weight: 20, order: 5},
    ],
  },
  {
    id: '2',
    title: 'Treino de Costas & Bíceps',
    description: 'Puxadas e roscas',
    duration: 55,
    caloriesBurned: 380,
    status: 'completed',
    completedAt: '2026-03-13T19:00:00',
    createdAt: '2026-03-13T18:05:00',
    exercises: [
      {id: 'e6', name: 'Puxada Frontal', sets: 4, reps: 10, weight: 55, order: 1},
      {id: 'e7', name: 'Remada Curvada', sets: 3, reps: 12, weight: 50, order: 2},
      {id: 'e8', name: 'Remada Unilateral', sets: 3, reps: 10, weight: 22, order: 3},
      {id: 'e9', name: 'Rosca Direta', sets: 3, reps: 12, weight: 14, order: 4},
    ],
  },
  {
    id: '3',
    title: 'Treino de Pernas',
    description: 'Agachamento e leg press',
    duration: 70,
    caloriesBurned: 520,
    status: 'completed',
    completedAt: '2026-03-12T18:45:00',
    createdAt: '2026-03-12T17:35:00',
    exercises: [
      {id: 'e11', name: 'Agachamento', sets: 4, reps: 10, weight: 80, order: 1},
      {id: 'e12', name: 'Leg Press', sets: 4, reps: 12, weight: 200, order: 2},
      {id: 'e13', name: 'Cadeira Extensora', sets: 3, reps: 15, weight: 45, order: 3},
      {id: 'e14', name: 'Cadeira Flexora', sets: 3, reps: 12, weight: 40, order: 4},
      {id: 'e15', name: 'Panturrilha', sets: 4, reps: 15, weight: 60, order: 5},
    ],
  },
  {
    id: '4',
    title: 'Treino de Ombros & Abdômen',
    description: 'Desenvolvimento e prancha',
    duration: 50,
    caloriesBurned: 310,
    status: 'in_progress',
    createdAt: '2026-03-14T19:00:00',
    exercises: [
      {id: 'e16', name: 'Desenvolvimento', sets: 4, reps: 10, weight: 30, order: 1},
      {id: 'e17', name: 'Elevação Lateral', sets: 3, reps: 15, weight: 10, order: 2},
      {id: 'e18', name: 'Elevação Frontal', sets: 3, reps: 12, weight: 10, order: 3},
      {id: 'e19', name: 'Prancha', sets: 3, reps: 1, duration: 60, order: 4},
    ],
  },
  {
    id: '5',
    title: 'Cardio HIIT',
    description: 'Intervalado na esteira',
    duration: 30,
    caloriesBurned: 350,
    status: 'planned',
    createdAt: '2026-03-15T07:00:00',
    exercises: [
      {id: 'e20', name: 'Aquecimento', sets: 1, duration: 300, order: 1},
      {id: 'e21', name: 'Sprint', sets: 8, duration: 30, order: 2},
      {id: 'e22', name: 'Desaquecimento', sets: 1, duration: 300, order: 3},
    ],
  },
];

export const weeklyActivity = [
  {day: 'Seg', minutes: 65},
  {day: 'Ter', minutes: 55},
  {day: 'Qua', minutes: 70},
  {day: 'Qui', minutes: 0},
  {day: 'Sex', minutes: 50},
  {day: 'Sáb', minutes: 0},
  {day: 'Dom', minutes: 0},
];

// ===== Social Types (Gymrats) =====
export type GroupType = 'challenge' | 'club';

export interface Group {
  id: string; name: string; type: GroupType; members: number; posts: number; description: string;
}

export interface Activity {
  id: string; userId: string; userName: string; userAvatar: string;
  content: string; photo?: string; likes: number; time: string;
}

export interface RankingEntry {
  userId: string; name: string; avatar: string; score: number;
}

export interface UserProfile {
  id: string; name: string; email: string; avatar: string; level: string;
  streak: number; checkIns: number; activeDays: number; activeTime: string;
  history: Record<string, {type: string; photo?: string}>;
}

export const mockGroups: Group[] = [
  {id: 'g1', name: 'Foco Verão 2026', type: 'challenge', members: 156, posts: 42, description: 'Desafio de 30 dias para queimar gordura.'},
  {id: 'g2', name: 'Clube do Supino', type: 'club', members: 890, posts: 1102, description: 'Comunidade para amantes de supino.'},
];

export const mockActivities: Activity[] = [
  {id: 'a1', userId: 'u3', userName: 'Bruno Costa', userAvatar: 'https://i.pravatar.cc/150?u=u3', content: 'Treino de pernas concluído!', photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400', likes: 12, time: 'há 2h'},
  {id: 'a2', userId: 'u1', userName: 'Matheus Silva', userAvatar: 'https://i.pravatar.cc/150?u=u1', content: 'Supino reto 80kg x 10!', photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', likes: 8, time: 'há 4h'},
  {id: 'a3', userId: 'u2', userName: 'Ana Silva', userAvatar: 'https://i.pravatar.cc/150?u=u2', content: 'Cardio matinal feito ✅', likes: 5, time: 'há 6h'},
];

export const mockRankings: Record<string, RankingEntry[]> = {
  weekly: [
    {userId: 'u3', name: 'Bruno Costa', avatar: 'https://i.pravatar.cc/150?u=u3', score: 12},
    {userId: 'u1', name: 'Matheus Silva', avatar: 'https://i.pravatar.cc/150?u=u1', score: 10},
    {userId: 'u2', name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=u2', score: 8},
  ],
  monthly: [
    {userId: 'u1', name: 'Matheus Silva', avatar: 'https://i.pravatar.cc/150?u=u1', score: 45},
    {userId: 'u3', name: 'Bruno Costa', avatar: 'https://i.pravatar.cc/150?u=u3', score: 42},
    {userId: 'u2', name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=u2', score: 30},
  ],
};

export const mockUserProfile: UserProfile = {
  id: 'u1', name: 'Matheus Silva', email: 'matheus@email.com',
  avatar: 'https://i.pravatar.cc/150?u=u1', level: 'Intermediário', streak: 5,
  checkIns: 42, activeDays: 18, activeTime: '1.240 min',
  history: {
    '2026-03-29': {type: 'workout', photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200'},
    '2026-03-28': {type: 'workout', photo: 'https://images.unsplash.com/photo-1541534741688-6078c64b52df?w=200'},
    '2026-03-26': {type: 'workout'},
    '2026-03-25': {type: 'workout', photo: 'https://images.unsplash.com/photo-1599058917233-358043bc6b96?w=200'},
  },
};

export const otherUsers: UserProfile[] = [
  {id: 'u2', name: 'Ana Silva', email: '', avatar: 'https://i.pravatar.cc/150?u=u2', level: 'Iniciante', streak: 2, checkIns: 38, activeDays: 10, activeTime: '980 min', history: {}},
  {id: 'u3', name: 'Bruno Costa', email: '', avatar: 'https://i.pravatar.cc/150?u=u3', level: 'Avançado', streak: 12, checkIns: 55, activeDays: 25, activeTime: '2.100 min', history: {'2026-03-29': {type: 'workout', photo: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200'}}},
];

export function getUserProfile(userId?: string): UserProfile {
  if (!userId || userId === mockUserProfile.id) return mockUserProfile;
  return otherUsers.find(u => u.id === userId) || mockUserProfile;
}

