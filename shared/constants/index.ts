// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    // Users
    USERS: {
        BASE: '/users',
        BY_ID: (id: string) => `/users/${id}`,
        UPDATE_PROFILE: '/users/profile',
        UPLOAD_AVATAR: '/users/avatar',
    },
    // Workouts
    WORKOUTS: {
        BASE: '/workouts',
        BY_ID: (id: string) => `/workouts/${id}`,
        STATS: '/workouts/stats',
        START: (id: string) => `/workouts/${id}/start`,
        COMPLETE: (id: string) => `/workouts/${id}/complete`,
    },
    // Exercises
    EXERCISES: {
        BASE: '/exercises',
        BY_WORKOUT: (workoutId: string) => `/workouts/${workoutId}/exercises`,
        BY_ID: (id: string) => `/exercises/${id}`,
    },
} as const;

// App Configuration
export const APP_CONFIG = {
    APP_NAME: 'StepForge',
    VERSION: '1.0.0',
    MAX_WORKOUT_DURATION: 180, // minutos
    MIN_WORKOUT_DURATION: 5, // minutos
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
    },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: '@stepforge/access_token',
    REFRESH_TOKEN: '@stepforge/refresh_token',
    USER_DATA: '@stepforge/user_data',
    THEME: '@stepforge/theme',
    LANGUAGE: '@stepforge/language',
} as const;
