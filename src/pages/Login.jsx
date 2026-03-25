import { useState } from 'react';
import api from '../services/api';
import './Auth.css';

export default function Login({ onLogin, goToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* FORM LOGIN */}
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p className="subtitle">Controle financeiro pessoal</p>

          <div className="input-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {error && <div className="auth-error">{error}</div>}

          <div className="register-link">
            <span>Não tem conta?</span>
            <button type="button" onClick={goToRegister}>
              Criar conta
            </button>
          </div>
        </form>
      </div>

      {/* IMAGEM CENTRAL */}
      <div className="finance-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
          alt="Finance"
        />
        <h1>Controle suas finanças de forma simples</h1>
      </div>

    </div>
  );
}