import { User, Workout, WorkoutStats } from './models';

// Auth
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

// Workouts
export interface CreateWorkoutRequest {
    title: string;
    description?: string;
    duration: number;
    caloriesBurned?: number;
}

export interface UpdateWorkoutRequest {
    title?: string;
    description?: string;
    duration?: number;
    caloriesBurned?: number;
    status?: string;
}

export interface WorkoutListResponse {
    data: Workout[];
    total: number;
    page: number;
    limit: number;
}

export interface WorkoutStatsResponse {
    stats: WorkoutStats;
}

// Generic API Response
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
