import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import './DashboardPage.css';

const statusIcons: Record<string, string> = {
  completed: '✅',
  in_progress: '🏋️',
  planned: '📋',
  cancelled: '❌',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<api.Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWorkouts()
      .then(data => {
        setWorkouts(Array.isArray(data) ? data : [data].filter(Boolean));
      })
      .catch(() => setWorkouts([]))
      .finally(() => setLoading(false));
  }, []);

  const recentWorkouts = workouts.slice(0, 4);
  const completedWorkouts = workouts.filter(w => w.status === 'completed');
  const totalDuration = completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const avgDuration = completedWorkouts.length > 0 ? Math.round(totalDuration / completedWorkouts.length) : 0;
  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);

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

  if (loading) {
    return (
      <div className="dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Olá, {user?.name?.split(' ')[0] || 'Atleta'}! 👋</h1>
        <p>Confira seu progresso e continue evoluindo.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-value">{workouts.length}</div>
          <div className="stat-label">Treinos totais</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{completedWorkouts.length}</div>
          <div className="stat-label">Treinos concluídos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{avgDuration > 0 ? `${avgDuration}min` : '-'}</div>
          <div className="stat-label">Média por treino</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-value">{totalExercises}</div>
          <div className="stat-label">Exercícios totais</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>📊 Atividade Semanal</h2>
          <div className="weekly-chart">
            {weeklyActivity.map((day) => (
              <div className="chart-bar-group" key={day.day}>
                <div className="chart-bar-wrapper">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${day.minutes > 0 ? (day.minutes / maxMinutes) * 100 : 3}%`,
                      opacity: day.minutes > 0 ? 1 : 0.2,
                    }}
                  >
                    {day.minutes > 0 && (
                      <span className="chart-bar-value">{day.minutes}min</span>
                    )}
                  </div>
                </div>
                <span className="chart-bar-label">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card">
          <h2>🕐 Treinos Recentes</h2>
          {recentWorkouts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Nenhum treino registrado ainda. Crie seu primeiro treino! 💪
            </p>
          ) : (
            recentWorkouts.map((w) => (
              <div className="recent-workout-item" key={w.id}>
                <div className={`workout-item-icon ${w.status}`}>
                  {statusIcons[w.status] || '📋'}
                </div>
                <div className="workout-item-info">
                  <h4>{w.title}</h4>
                  <span>{w.exercises.length} exercícios</span>
                </div>
                <div className="workout-item-meta">
                  {w.duration && <div className="duration">{w.duration}min</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
