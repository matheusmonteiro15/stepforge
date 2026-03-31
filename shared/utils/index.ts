/**
 * Valida se o email é válido
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida força da senha
 * Requisitos: Mínimo 8 caracteres, 1 letra maiúscula, 1 minúscula, 1 número
 */
export const isStrongPassword = (password: string): boolean => {
    if (password.length < 8) return false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Valida formato de peso (kg)
 */
export const isValidWeight = (weight: number): boolean => {
    return weight > 0 && weight < 500;
};

/**
 * Valida formato de altura (cm)
 */
export const isValidHeight = (height: number): boolean => {
    return height > 50 && height < 300;
};

/**
 * Formata peso em kg
 */
export const formatWeight = (kg: number): string => {
    return `${kg.toFixed(1)} kg`;
};

/**
 * Formata duração em minutos para horas/minutos
 */
export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes}min`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${mins}min`;
};

/**
 * Formata calorias
 */
export const formatCalories = (calories: number): string => {
    return `${Math.round(calories)} kcal`;
};

/**
 * Calcula IMC (Índice de Massa Corporal)
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
};

/**
 * Calcula categoria do IMC
 */
export const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
};

/**
 * Formata data para exibição
 */
export const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
};

/**
 * Formata data e hora
 */
export const formatDateTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('pt-BR');
};

/**
 * Calcula diferença de dias entre duas datas
 */
export const daysDifference = (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
