import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function GroupInfoPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState<api.Group | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (groupId) {
      api.getGroup(groupId).then(async (g) => {
        setGroup(g);
        if (g.ownerId) {
          try {
            const owner = await api.getUser(g.ownerId);
            setAdmin(owner);
          } catch {
            setAdmin(null);
          }
        }
      }).finally(() => setLoading(false));
    }
  }, [groupId]);

  const participants = [admin].filter(Boolean); // For now, only the admin is in the participants list since we don't have members logic yet

  const handleDeleteGroup = async () => {
    if (!window.confirm('Tem certeza que deseja EXCLUIR este grupo? Esta ação não pode ser desfeita.')) return;
    setDeleting(true);
    try {
      if (groupId) {
        await api.deleteGroup(groupId);
        navigate('/groups', { replace: true });
      }
    } catch {
      alert('Erro ao excluir grupo.');
      setDeleting(false);
    }
  };

  const handleLeaveGroup = () => {
    alert('Sair de grupos ainda não está implementado.');
  };

  if (loading) return <div style={{ color: 'white', padding: 20 }}>Carregando...</div>;
  if (!group) return <div style={{ color: 'white', padding: 20 }}>Grupo não encontrado.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1 as any)}
          style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '15px' }}
        >
          ← Voltar
        </button>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Detalhes do Grupo</h1>
      </div>

      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
          👥
        </div>
        <h2 style={{ fontSize: '28px', margin: '0 0 8px' }}>{group.name}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Criado em {group.createdAt ? new Date(group.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}</p>
      </div>

      {admin && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 16px' }}>Administrador</h3>
          <div 
            onClick={() => navigate(`/user/${admin.id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '12px', transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
          >
            <img src={admin.avatarUrl || 'https://i.pravatar.cc/150'} alt={admin.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 600 }}>{admin.id === user?.id ? 'Você' : admin.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--primary)' }}>Criador do Grupo</div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', margin: 0 }}>Participantes ({participants.length})</h3>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => alert("Exibir modal ou lista completa não implementada no mock")}
          >
            Ver Todas
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {participants.length === 0 && <p style={{color: 'var(--text-muted)', fontSize: 14}}>Nenhum outro participante ainda.</p>}
          {participants.slice(0, 8).map(p => (
            <img 
              key={p.id}
              src={p.avatarUrl || 'https://i.pravatar.cc/150'} 
              alt={p.name}
              onClick={() => navigate(`/user/${p.id}`)}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: '2px solid transparent' }}
              onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onMouseOut={e => (e.currentTarget.style.borderColor = 'transparent')}
              title={p.id === user?.id ? 'Você' : p.name}
            />
          ))}
        </div>
      </div>

      {user?.id === group.ownerId ? (
        <button 
          onClick={handleDeleteGroup}
          disabled={deleting}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)', fontSize: '16px', fontWeight: 600, cursor: 'pointer', opacity: deleting ? 0.7 : 1 }}
        >
          {deleting ? 'Excluindo...' : 'Excluir Grupo'}
        </button>
      ) : (
        <button 
          onClick={handleLeaveGroup}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
        >
          Sair do Grupo
        </button>
      )}
    </div>
  );
}
