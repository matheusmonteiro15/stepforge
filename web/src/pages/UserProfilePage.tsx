import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './UserProfilePage.css';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      api.getUser(userId).then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
    }
  }, [userId]);

  const calendarDays = Array.from({ length: 31 }, (_, i) => ({ day: i + 1, data: null as any }));
  const stats = { streak: 12, level: 'Iniciante', checkIns: 45, activeDays: 28, activeTime: '42h' };

  if (loading) return <div style={{ color: 'white', padding: 20 }}>Carregando perfil...</div>;
  if (!user) return <div style={{ color: 'white', padding: 20 }}>Usuário não encontrado.</div>;

  return (
    <div className="user-profile-page">
      <div className="profile-header-row">
        <button className="btn-back" onClick={() => navigate(-1 as any)}>← Voltar</button>
        <h1>Perfil do Atleta</h1>
      </div>

      <div className="profile-hero glass-card">
        <img src={user.avatarUrl || 'https://i.pravatar.cc/150'} alt="" className="profile-avatar-lg" />
        <div className="profile-hero-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email || 'Membro de Grupo'}</p>
          <div className="profile-badges">
            <span className="badge fire">🔥 {stats.streak} dias</span>
            <span className="badge level">{stats.level}</span>
          </div>
        </div>
      </div>

      <div className="profile-stats-row">
        <div className="stat-card glass-card">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{stats.checkIns}</span>
          <span className="stat-label">Check-ins</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{stats.activeDays}</span>
          <span className="stat-label">Dias Ativos</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{stats.activeTime}</span>
          <span className="stat-label">Tempo</span>
        </div>
      </div>

      <h2 className="section-title">📅 Calendário de Treinos</h2>
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
  );
}
