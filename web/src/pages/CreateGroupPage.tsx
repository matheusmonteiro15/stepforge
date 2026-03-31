import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import './CreateGroupPage.css';

export default function CreateGroupPage() {
  const navigate = useNavigate();
  // Simple state for type selection (UI only)
  const [groupType, setGroupType] = useState('challenge');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await api.createGroup({
        name: name.trim(),
        description: desc.trim(),
        membersCount: 1, // Start with 1 member (the creator)
      });
      navigate('/groups');
    } catch {
      alert('Erro ao criar grupo');
    }
  };

  return (
    <div className="create-group-page">
      <h1>Criar Novo Grupo 🚀</h1>
      <p className="subtitle">Escolha o tipo e dê um nome ao seu grupo.</p>

      <h2 className="section-label">Tipo de Grupo</h2>
      <div className="type-cards">
        <div
          className={`type-card ${groupType === 'challenge' ? 'selected challenge' : ''}`}
          onClick={() => setGroupType('challenge')}
        >
          <div className="type-icon challenge-icon">⭐</div>
          <h3>Desafio</h3>
          <p>Metas de curto prazo. Ex: &apos;30 dias de agachamento&apos;</p>
        </div>
        <div
          className={`type-card ${groupType === 'club' ? 'selected club' : ''}`}
          onClick={() => setGroupType('club')}
        >
          <div className="type-icon club-icon">👥</div>
          <h3>Clube</h3>
          <p>Comunidade contínua. Troca de experiências.</p>
        </div>
      </div>

      <h2 className="section-label">Detalhes</h2>
      <input
        className="input-field"
        placeholder="Nome do Grupo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="input-field textarea"
        placeholder="Descrição (opcional)"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={3}
      />
      <button className="btn-primary create-btn" onClick={handleCreate}>
        Criar Grupo
      </button>
    </div>
  );
}
