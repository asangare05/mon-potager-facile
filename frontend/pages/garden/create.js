import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../../utils/api';

export default function CreateGarden() {
  const [formData, setFormData] = useState({
    region: '',
    surface_m2: '',
    type_culture: 'pleine_terre',
    arrosage: 'manuel',
    niveau: 'debutant'
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validation simple
      if (!formData.region || !formData.surface_m2) {
        setError('Veuillez remplir tous les champs obligatoires');
        setIsSubmitting(false);
        return;
      }

      // Surface doit être un nombre
      if (isNaN(formData.surface_m2)) {
        setError('La surface doit être un nombre');
        setIsSubmitting(false);
        return;
      }

      const response = await api.post('/garden', formData);
      console.log('Potager créé:', response.data);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Erreur lors de la création du potager:', err);
      setError('Une erreur est survenue lors de la création du potager');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f9f0',
      padding: '1rem'
    }}>
      {/* Barre de navigation */}
      <div style={{
        backgroundColor: '#3e8e41',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Link href="/dashboard" style={{ 
          color: 'white', 
          fontWeight: 'bold', 
          fontSize: '1.25rem',
          textDecoration: 'none'
        }}>
          Mon Potager Facile
        </Link>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          style={{
            backgroundColor: 'white',
            color: '#3e8e41',
            border: 'none',
            borderRadius: '0.25rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
        >
          Déconnexion
        </button>
      </div>

      {/* Contenu principal */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2f6e31',
          marginBottom: '1.5rem'
        }}>Créer mon potager</h1>
        
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
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="region">
              Région*
            </label>
            <input 
              type="text" 
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              placeholder="Ex: Île-de-France, PACA, Bretagne..."
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="surface_m2">
              Surface (m²)*
            </label>
            <input 
              type="number" 
              id="surface_m2"
              name="surface_m2"
              value={formData.surface_m2}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              min="1"
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="type_culture">
              Type de culture
            </label>
            <select 
              id="type_culture"
              name="type_culture"
              value={formData.type_culture}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            >
              <option value="pleine_terre">Pleine terre</option>
              <option value="bac">En bac</option>
              <option value="serre">Sous serre</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="arrosage">
              Type d'arrosage
            </label>
            <select 
              id="arrosage"
              name="arrosage"
              value={formData.arrosage}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            >
              <option value="manuel">Manuel</option>
              <option value="automatique">Automatique</option>
              <option value="goutte_a_goutte">Goutte à goutte</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="niveau">
              Niveau d'expérience
            </label>
            <select 
              id="niveau"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            >
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              type="submit" 
              style={{
                backgroundColor: '#3e8e41',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.25rem',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer'
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création en cours...' : 'Créer mon potager'}
            </button>
            
            <Link href="/dashboard" style={{
              color: '#3e8e41',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}