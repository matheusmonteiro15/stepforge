import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './GroupsPage.css';

export default function GroupsPage() {
  const [groups, setGroups] = useState<api.Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getGroups()
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: 'white', padding: 20 }}>Carregando grupos...</div>;

  return (
    <div className="groups-page">
      <div className="page-header">
        <h1>Meus Grupos</h1>
        <button className="btn-primary" onClick={() => navigate('/groups/create')}>
          + Criar Grupo
        </button>
      </div>

      <div className="groups-grid">
        {groups.map((g) => (
          <div key={g.id} className="group-card glass-card" onClick={() => navigate(`/groups/${g.id}`)}>
            <div className="group-card-header">
              <div className="group-icon">👥</div>
              <div className="group-info">
                <h3>{g.name}</h3>
              </div>
            </div>
            <p className="group-desc">{g.description}</p>
            <div className="group-meta">
              <span>👥 {g.membersCount || 0} membros</span>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <p>Nenhum grupo ainda. Crie o primeiro!</p>
        </div>
      )}
    </div>
  );
}
