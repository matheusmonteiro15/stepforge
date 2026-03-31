export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Não retornado pela API
    weight?: number;
    height?: number;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Workout {
    id: string;
    userId: string;
    title: string;
    description?: string;
    duration: number; // em minutos
    caloriesBurned?: number;
    exercises: Exercise[];
    status: WorkoutStatus;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Exercise {
    id: string;
    workoutId: string;
    name: string;
    sets?: number;
    reps?: number;
    weight?: number; // em kg
    duration?: number; // em segundos
    distance?: number; // em metros
    notes?: string;
    order: number;
}

export enum WorkoutStatus {
    PLANNED = 'planned',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export interface WorkoutStats {
    totalWorkouts: number;
    totalDuration: number; // em minutos
    totalCaloriesBurned: number;
    averageWorkoutDuration: number;
    currentStreak: number; // dias consecutivos
}
