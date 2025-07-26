import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { commonStyles } from '../utils/styles';
import api from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Stocker le token dans localStorage
      localStorage.setItem('token', response.data.token);
      
      // Rediriger vers le tableau de bord
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Identifiants invalides');
      setIsSubmitting(false);
    }
  };


  return (
    <div style={commonStyles.page}>
      <div style={commonStyles.card}>
        <h1 style={commonStyles.heading}>Connexion</h1>
        
        {error && (
          <div style={commonStyles.error}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={commonStyles.inputGroup}>
            <label style={commonStyles.label} htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={commonStyles.input}
              required
            />
          </div>
          
          <div style={commonStyles.inputGroup}>
            <label style={commonStyles.label} htmlFor="password">
              Mot de passe
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={commonStyles.input}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={commonStyles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <div style={commonStyles.linkContainer}>
          <p>
            Pas encore de compte ? {' '}
            <Link href="/signup" style={commonStyles.link}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}