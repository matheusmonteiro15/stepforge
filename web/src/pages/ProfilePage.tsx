import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [workouts, setWorkouts] = useState<api.Workout[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');

  useEffect(() => {
    api.getWorkouts()
      .then(data => setWorkouts(Array.isArray(data) ? data : [data].filter(Boolean)))
      .catch(() => setWorkouts([]));
  }, []);

  const genderLabel: Record<string, string> = {
    male: 'Masculino',
    female: 'Feminino',
    other: 'Outro',
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateProfile({
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
      });
      await refreshUser();
      setEditing(false);
    } catch {
      alert('Erro ao salvar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const completedWorkouts = workouts.filter(w => w.status === 'completed');
  const totalDuration = completedWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalHours = Math.floor(totalDuration / 60);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(i).padStart(2, '0');
    // We compare with the ISO date portion of `createdAt` or `updatedAt`
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    // Check if there is any completed workout exactly on this day
    const workoutThatDay = completedWorkouts.find(w => {
      // Backend updatedAt format usually ISO `2026-03-30T15:00:00Z`
      const targetDate = w.updatedAt || w.createdAt || '';
      return targetDate.startsWith(dateStr);
    });
    
    // Add photo mock functionality for UI aesthetics if the user uploaded an activity, but here we just leave standard checking
    calendarDays.push({ day: i, data: workoutThatDay ? { photo: null } : null });
  }

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="profile-info">
          <h1>{user?.name || 'Usuário'}</h1>
          <p>{user?.email || ''}</p>
          <span className="member-since">
            Membro desde {formatDate(user?.createdAt)}
          </span>
        </div>
      </div>

      <div className="profile-section">
        <h2>📊 Conquistas</h2>
        <div className="achievement-grid">
          <div className="achievement-card">
            <div className="ach-icon">🏋️</div>
            <div className="ach-value">{workouts.length}</div>
            <div className="ach-label">Treinos</div>
          </div>
          <div className="achievement-card">
            <div className="ach-icon">✅</div>
            <div className="ach-value">{completedWorkouts.length}</div>
            <div className="ach-label">Concluídos</div>
          </div>
          <div className="achievement-card">
            <div className="ach-icon">⏱️</div>
            <div className="ach-value">{totalHours > 0 ? `${totalHours}h` : '-'}</div>
            <div className="ach-label">Treino Total</div>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>👤 Dados Pessoais</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.4rem 1rem', color: 'var(--text-primary, #fff)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✏️ Editar
            </button>
          )}
        </div>
        <div className="profile-grid">
          <div className="profile-field">
            <label>Peso</label>
            {editing ? (
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="Ex: 78"
                style={inputStyle}
              />
            ) : (
              <span className="value">{user?.weight ? `${user.weight} kg` : '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Altura</label>
            {editing ? (
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="Ex: 175"
                style={inputStyle}
              />
            ) : (
              <span className="value">{user?.height ? `${user.height} cm` : '-'}</span>
            )}
          </div>
          <div className="profile-field">
            <label>Gênero</label>
            <span className="value">{user?.gender ? genderLabel[user.gender] : '-'}</span>
          </div>
        </div>

        {editing && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              style={{ flex: 1, background: 'var(--accent-gradient, linear-gradient(135deg, #667eea, #764ba2))', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={() => { setEditing(false); setWeight(user?.weight?.toString() || ''); setHeight(user?.height?.toString() || ''); }}
              style={{ padding: '0.6rem 1.5rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>📅 Calendário de Treinos</h2>
        <div className="calendar-grid">
          {calendarDays.map(({ day, data }) => (
            <div key={day} className={`calendar-cell ${data ? 'active' : ''}`}>
              {data?.photo ? (
                <img src={data.photo} alt="" className="calendar-photo" />
              ) : data ? (
                <span className="calendar-check">✓</span>
              ) : (
                <span className="calendar-day">{day}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Sair da Conta
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8,
  padding: '0.5rem 0.8rem',
  color: 'var(--text-primary, #fff)',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
};
