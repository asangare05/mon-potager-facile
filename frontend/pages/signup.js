import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { commonStyles } from '../utils/styles';
import api from '../utils/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/register', { email, password });
      
      // Stocker le token dans localStorage
      localStorage.setItem('token', response.data.token);
      
      // Rediriger vers le tableau de bord
      console.log("Tentative de redirection vers /dashboard");
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Erreur lors de l\'inscription');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f9f0', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#2f6e31', 
          marginBottom: '1.5rem' 
        }}>Créer un compte</h1>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            border: '1px solid #ef4444', 
            color: '#b91c1c', 
            padding: '0.75rem 1rem', 
            borderRadius: '0.25rem', 
            marginBottom: '1rem' 
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#4b5563', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }} htmlFor="email">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.25rem', 
                fontSize: '1rem' 
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#4b5563', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }} htmlFor="password">
              Mot de passe
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.25rem', 
                fontSize: '1rem' 
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#4b5563', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              marginBottom: '0.5rem' 
            }} htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <input 
              type="password" 
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.25rem', 
                fontSize: '1rem' 
              }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={{ 
              width: '100%',
              backgroundColor: '#3e8e41', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '0.25rem', 
              fontWeight: '500',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Création en cours...' : 'Créer un compte'}
          </button>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>
            Déjà inscrit ? {' '}
            <Link href="/login" style={{ color: '#3e8e41', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}