import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthPage.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <div className="auth-logo">
          <div className="logo-icon">💪</div>
          <h1>StepForge</h1>
        </div>
        <p className="auth-subtitle">Crie sua conta e comece a treinar</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError(); }}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">E-mail</label>
            <input
              id="reg-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Senha</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-confirm">Confirmar Senha</label>
            <input
              id="reg-confirm"
              type="password"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
              disabled={loading}
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
