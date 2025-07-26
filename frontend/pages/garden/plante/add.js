import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../../../utils/api';

export default function AddPlant() {
  const [formData, setFormData] = useState({
    nom: '',
    date_plantation: new Date().toISOString().split('T')[0],
    arrosage_prochain: '',
    recolte_estimee: '',
    notes: ''
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
      if (!formData.nom) {
        setError('Le nom de la plante est obligatoire');
        setIsSubmitting(false);
        return;
      }

      await api.post('/garden/plante', formData);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la plante:', err);
      setError('Une erreur est survenue lors de l\'ajout de la plante');
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
        }}>Ajouter une plante</h1>
        
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
            }} htmlFor="nom">
              Nom de la plante*
            </label>
            <input 
              type="text" 
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
              placeholder="Ex: Tomate, Carotte, Basilic..."
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="date_plantation">
              Date de plantation
            </label>
            <input 
              type="date" 
              id="date_plantation"
              name="date_plantation"
              value={formData.date_plantation}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="arrosage_prochain">
              Prochain arrosage
            </label>
            <input 
              type="date" 
              id="arrosage_prochain"
              name="arrosage_prochain"
              value={formData.arrosage_prochain}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="recolte_estimee">
              Récolte estimée
            </label>
            <input 
              type="date" 
              id="recolte_estimee"
              name="recolte_estimee"
              value={formData.recolte_estimee}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }} htmlFor="notes">
              Notes
            </label>
            <textarea 
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '1rem',
                minHeight: '100px'
              }}
              placeholder="Notes optionnelles sur cette plante..."
            ></textarea>
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
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter la plante'}
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