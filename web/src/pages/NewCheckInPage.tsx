import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import './GroupsPage.css'; // Reusing some base styles

export default function NewCheckInPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [activity, setActivity] = useState('Musculação');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async () => {
    if (!title) return alert('O título é obrigatório.');
    
    try {
      // 1. Create feed activity (Group View)
      await api.createActivity({
        userId: user?.id || 'u1',
        userName: user?.name || 'Você',
        userAvatar: 'https://i.pravatar.cc/150?u=me',
        content: description ? `${title}\n${description}` : title,
        photo: image || undefined,
        groupId: groupId || undefined
      });

      // 2. Register as a completed Workout (Profile / Workouts View)
      await api.createWorkout({
        title: title.trim(),
        description: description || activity,
        status: 'completed',
        duration: duration ? parseInt(duration) : undefined,
        exercises: [] // empty exercises for simple check-in
      });

      navigate(`/groups/${groupId}`);
    } catch {
      alert('Erro ao publicar check-in');
    }
  };

  return (
    <div style={{ maxWidth: '600px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '15px' }}
            onClick={() => navigate(`/groups/${groupId}`)}
          >
            Cancelar
          </button>
          <h1 style={{ fontSize: '22px', margin: 0 }}>Novo check-in</h1>
        </div>
        <button 
          onClick={handlePublish}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          Publicar
        </button>
      </div>

      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="Título do treino*" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          style={inputStyle} 
        />
        <textarea 
          placeholder="Descrição (opcional)" 
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Dia</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Hora</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Atividade</label>
            <select value={activity} onChange={e => setActivity(e.target.value)} style={inputStyle}>
              <option>Musculação</option>
              <option>Corrida</option>
              <option>Ciclismo</option>
              <option>Yoga</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Duração (minutos)</label>
            <input type="number" placeholder="Ex: 45" value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Distância (km) - Opcional</label>
            <input type="number" placeholder="Ex: 5" value={distance} onChange={e => setDistance(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Calorias - Opcional</label>
            <input type="number" placeholder="Ex: 300" value={calories} onChange={e => setCalories(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginTop: '8px' }}>
          <label style={labelStyle}>Adicionar Foto</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block', marginTop: '8px', color: 'var(--text-muted)' }} />
          {image && (
            <img src={image} alt="Preview" style={{ marginTop: '12px', width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} />
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  fontSize: '15px',
  outline: 'none'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  fontWeight: 600
};
