import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './GroupDetailPage.css';

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [rankTab, setRankTab] = useState<'weekly' | 'monthly'>('weekly');

  const [group, setGroup] = useState<api.Group | null>(null);
  const [activities, setActivities] = useState<api.Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    Promise.all([
      api.getGroup(groupId).catch(() => null),
      api.getActivities(groupId).catch(() => []),
    ]).then(([g, a]) => {
      setGroup(g);
      setActivities(a);
      setLoading(false);
    });
  }, [groupId]);

  const mockRankings = {
    weekly: [],
    monthly: []
  };
  const rankings = mockRankings[rankTab] || mockRankings.weekly;

  if (loading) return <div style={{ color: 'white', padding: 20 }}>Carregando grupo...</div>;
  if (!group) return <div style={{ color: 'white', padding: 20 }}>Grupo não encontrado.</div>;

  return (
    <div className="group-detail-page">
      <div className="group-detail-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-back" onClick={() => navigate('/groups')}>← Voltar</button>
          <h1>{group.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(`/groups/${groupId}/info`)}
            style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            Detalhes
          </button>
          <button 
            onClick={() => navigate(`/groups/${groupId}/checkin`)}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
          >
            +
          </button>
        </div>
      </div>
      <div className="group-detail-meta">
        <span className="meta-fire">🔥 {group.membersCount || 0} membros</span>
        <span className="meta-sep">•</span>
        <span className="meta-posts">{activities.length} posts</span>
      </div>

      <div className="group-detail-content">
        {/* Feed */}
        <div className="feed-column">
          <h2 className="section-title">📰 Feed de Atividades</h2>
          <div className="feed-list">
            {activities.length === 0 && <p style={{color: 'var(--text-muted)'}}>Nenhuma atividade. Seja o primeiro a postar!</p>}
            {activities.map((act) => (
              <div key={act.id} className="feed-card glass-card" onClick={() => navigate(`/post/${act.id}`)} style={{ cursor: 'pointer' }}>
                <div className="feed-card-header">
                  <img src={act.userAvatar || 'https://i.pravatar.cc/150'} alt="" className="feed-avatar" />
                  <div>
                    <strong>{act.userName}</strong>
                    <span className="feed-time">{act.time || new Date(act.createdAt || '').toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="feed-content">{act.content}</p>
                {act.photo && <img src={act.photo} alt="" className="feed-photo" />}
                <div className="feed-actions">
                  <span>❤️ {act.likes}</span>
                  <span>💬 Comentar</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking */}
        <div className="ranking-column">
          <h2 className="section-title">🏆 Classificação</h2>
          <div className="rank-tabs">
            <button className={rankTab === 'weekly' ? 'active' : ''} onClick={() => setRankTab('weekly')}>Semana</button>
            <button className={rankTab === 'monthly' ? 'active' : ''} onClick={() => setRankTab('monthly')}>Mês</button>
          </div>
          <div className="rank-list">
            {rankings.length === 0 && <p style={{color: 'var(--text-muted)', fontSize: 13}}>Nenhum ranking disponível no momento.</p>}
            {rankings.map((u: any, i: number) => (
              <div key={u.userId} className="rank-item" onClick={() => navigate(`/user/${u.userId}`)}>
                <span className={`rank-pos rank-${i + 1}`}>{i + 1}</span>
                <img src={u.avatar} alt="" className="rank-avatar" />
                <span className="rank-name">{u.name}</span>
                <span className="rank-score">{u.score} pts</span>
              </div>
            ))}
          </div>
          <div className="goal-card glass-card">
            <strong>Meta de Hoje</strong>
            <div className="goal-bar"><div className="goal-fill" style={{ width: '60%' }} /></div>
            <span className="goal-text">6/10 membros completaram</span>
          </div>
        </div>
      </div>
    </div>
  );
}
