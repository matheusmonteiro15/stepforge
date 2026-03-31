import { useState, useEffect } from 'react';
import * as api from '../services/api';
import './WorkoutsPage.css';

const statusLabels: Record<string, string> = {
  all: 'Todos',
  planned: 'Planejado',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
};

const statusDisplay: Record<string, string> = {
  completed: 'Concluído',
  in_progress: 'Em andamento',
  planned: 'Planejado',
};

type StatusFilter = 'all' | 'planned' | 'in_progress' | 'completed';

export default function WorkoutsPage() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [workouts, setWorkouts] = useState<api.Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // New workout form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState<api.CreateExerciseInput[]>([
    { name: '', sets: 3, reps: 10, weight: 0 },
  ]);

  const loadWorkouts = () => {
    setLoading(true);
    api.getWorkouts()
      .then(data => setWorkouts(Array.isArray(data) ? data : [data].filter(Boolean)))
      .catch(() => setWorkouts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadWorkouts(); }, []);

  const filteredWorkouts = filter === 'all'
    ? workouts
    : workouts.filter(w => w.status === filter);

  // Group workouts by Date (YYYY-MM-DD for easy sorting, converted later for UI)
  const groupedWorkouts = filteredWorkouts.reduce((acc, curr) => {
    // Parse the ISO string or fallback
    const d = new Date(curr.createdAt || curr.updatedAt || Date.now());
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;

    if (!acc[isoDate]) acc[isoDate] = [];
    acc[isoDate].push(curr);
    return acc;
  }, {} as Record<string, api.Workout[]>);

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => b.localeCompare(a));

  const formatDateLabel = (isoDate: string) => {
    const today = new Date();
    const target = new Date(isoDate + 'T12:00:00'); // avoiding timezone slips
    if (today.toISOString().split('T')[0] === isoDate) return 'Hoje';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toISOString().split('T')[0] === isoDate) return 'Ontem';
    return target.toLocaleDateString('pt-BR');
  };

  const formatExerciseDetail = (ex: api.Exercise) => {
    const parts: string[] = [];
    if (ex.sets && ex.reps) parts.push(`${ex.sets}×${ex.reps}`);
    if (ex.weight) parts.push(`${Number(ex.weight)}kg`);
    return parts.join(' · ') || '-';
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 10, weight: 0 }]);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const updateExercise = (index: number, field: string, value: string | number) => {
    const updated = [...exercises];
    (updated[index] as any)[field] = value;
    setExercises(updated);
  };

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) return;

    setFormLoading(true);
    try {
      await api.createWorkout({
        title: title.trim(),
        description: description.trim() || undefined,
        duration: duration ? parseInt(duration) : undefined,
        exercises: validExercises,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setDuration('');
      setExercises([{ name: '', sets: 3, reps: 10, weight: 0 }]);
      setShowForm(false);
      loadWorkouts();
    } catch (err) {
      alert('Erro ao criar treino. Tente novamente.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (workout: api.Workout) => {
    const nextStatus = workout.status === 'planned' ? 'in_progress'
      : workout.status === 'in_progress' ? 'completed'
      : 'planned';
    try {
      await api.updateWorkout(workout.id, { status: nextStatus });
      loadWorkouts();
    } catch {
      alert('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este treino?')) return;
    try {
      await api.deleteWorkout(id);
      loadWorkouts();
    } catch {
      alert('Erro ao excluir treino.');
    }
  };

  if (loading) {
    return (
      <div className="workouts-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Carregando treinos...</p>
      </div>
    );
  }

  return (
    <div className="workouts-page">
      <div className="workouts-header">
        <h1>Meus Treinos</h1>
        <button className="new-workout-btn" onClick={() => setShowForm(!showForm)}>
          <span>{showForm ? '✕' : '+'}</span> {showForm ? 'Cancelar' : 'Novo Treino'}
        </button>
      </div>

      {/* New Workout Form */}
      {showForm && (
        <div className="workout-form-card" style={{ background: 'var(--card-bg, rgba(255,255,255,0.05))', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary, #fff)' }}>➕ Novo Treino</h3>
          <form onSubmit={handleCreateWorkout}>
            <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Nome do treino (ex: Treino de Peito)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Duração em minutos (opcional)"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                style={inputStyle}
              />
            </div>

            <h4 style={{ color: 'var(--text-primary, #fff)', marginBottom: '0.5rem' }}>Exercícios</h4>
            {exercises.map((ex, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 70px 80px auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Nome do exercício"
                  value={ex.name}
                  onChange={e => updateExercise(i, 'name', e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Séries"
                  value={ex.sets}
                  onChange={e => updateExercise(i, 'sets', parseInt(e.target.value) || 0)}
                  style={inputStyle}
                  min={1}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={e => updateExercise(i, 'reps', parseInt(e.target.value) || 0)}
                  style={inputStyle}
                  min={1}
                />
                <input
                  type="number"
                  placeholder="Peso (kg)"
                  value={ex.weight || ''}
                  onChange={e => updateExercise(i, 'weight', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
                <button type="button" onClick={() => removeExercise(i)} style={{ background: 'transparent', border: 'none', color: '#f44', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={addExercise} style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.3)', color: 'var(--text-muted)', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer', marginBottom: '1rem', width: '100%' }}>
              + Adicionar exercício
            </button>

            <button type="submit" disabled={formLoading} style={{ background: 'var(--accent-gradient, linear-gradient(135deg, #667eea, #764ba2))', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: 12, cursor: 'pointer', fontSize: '1rem', fontWeight: 600, width: '100%' }}>
              {formLoading ? 'Salvando...' : 'Salvar Treino'}
            </button>
          </form>
        </div>
      )}

      <div className="workouts-filters">
        {(['all', 'planned', 'in_progress', 'completed'] as const).map(s => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="workout-empty">
          <div className="empty-icon">🏋️</div>
          <p>{workouts.length === 0 ? 'Nenhum treino registrado. Crie seu primeiro!' : 'Nenhum treino encontrado com esse filtro.'}</p>
        </div>
      ) : (
        <div className="workouts-grouped-list">
          {sortedDates.map(dateKey => (
            <div key={dateKey} className="workout-date-group" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {formatDateLabel(dateKey)}
              </h2>
              <div className="workouts-grid">
                {groupedWorkouts[dateKey].map(w => (
                  <div className="workout-card" key={w.id}>
                    <div className="workout-card-header">
                      <div>
                        <h3>{w.title}</h3>
                        {w.description && <p>{w.description}</p>}
                      </div>
                      <span className={`workout-status-badge ${w.status}`}>
                        {statusDisplay[w.status]}
                      </span>
                    </div>

                    <div className="workout-card-stats">
                      {w.duration && (
                        <div className="workout-card-stat">
                          <span className="stat-emoji">⏱️</span>
                          {w.duration}min
                        </div>
                      )}
                      <div className="workout-card-stat">
                        <span className="stat-emoji">💪</span>
                        {w.exercises?.length || 0} exercícios
                      </div>
                    </div>

                    {w.exercises && w.exercises.length > 0 && (
                      <div className="workout-exercises-preview">
                        <h4>Exercícios</h4>
                        <div className="exercise-preview-list">
                          {w.exercises.slice(0, 4).map(ex => (
                            <div className="exercise-preview-item" key={ex.id}>
                              <span className="name">{ex.name}</span>
                              <span className="detail">{formatExerciseDetail(ex)}</span>
                            </div>
                          ))}
                          {w.exercises.length > 4 && (
                            <div className="exercise-preview-item">
                              <span className="name" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                +{w.exercises.length - 4} mais...
                              </span>
                              <span className="detail"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button
                        onClick={() => handleToggleStatus(w)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary, #fff)', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        {w.status === 'planned' ? '▶️ Iniciar' : w.status === 'in_progress' ? '✅ Concluir' : '🔄 Reabrir'}
                      </button>
                      <button
                        onClick={() => handleDelete(w.id)}
                        style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(255,100,100,0.1)', color: '#f88', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8,
  padding: '0.6rem 0.8rem',
  color: 'var(--text-primary, #fff)',
  fontSize: '0.9rem',
  outline: 'none',
};
