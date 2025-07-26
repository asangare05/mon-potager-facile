import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [garden, setGarden] = useState(null);
  const [isLoadingGarden, setIsLoadingGarden] = useState(true);

  // Charger les données du potager
  useEffect(() => {
      const fetchGarden = async () => {
    try {
      console.log("Tentative d'appel à l'API:", '/garden');
      const res = await api.get('/garden');
      console.log("Réponse reçue:", res.data);
      setGarden(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement du potager:', err);
      
      // Afficher plus de détails sur l'erreur
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Données:', err.response.data);
      }
    } finally {
      setIsLoadingGarden(false);
    }
  };
    /*
    const fetchGarden = async () => {
      try {
        const res = await api.get('/garden');
        setGarden(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement du potager:', err);
      } finally {
        setIsLoadingGarden(false);
      }
    };

    */

    if (user) {
      fetchGarden();
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f9f0'
      }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    // Si pas d'utilisateur connecté, rediriger
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

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
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Mon Potager Facile</div>
        <button 
          onClick={logout}
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
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#2f6e31',
          marginBottom: '1.5rem'
        }}>
          Bienvenue, {user.email}!
        </h1>
        
        {isLoadingGarden ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <p>Chargement de votre potager...</p>
          </div>
        ) : garden ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2f6e31',
              marginBottom: '1rem'
            }}>Mon Potager</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <p><strong>Région:</strong> {garden.region}</p>
                <p><strong>Surface:</strong> {garden.surface_m2} m²</p>
              </div>
              <div>
                <p><strong>Type de culture:</strong> {garden.type_culture}</p>
                <p><strong>Arrosage:</strong> {garden.arrosage}</p>
                <p><strong>Niveau:</strong> {garden.niveau}</p>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.5rem'
            }}>
              <Link href="/garden/edit" style={{
                color: '#3e8e41',
                textDecoration: 'none'
              }}>
                Modifier mon potager
              </Link>
              
              <button 
                onClick={async () => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer votre potager ?')) {
                    try {
                      await api.delete('/garden');
                      setGarden(null);
                    } catch (err) {
                      console.error('Erreur lors de la suppression:', err);
                      alert('Erreur lors de la suppression du potager');
                    }
                  }
                }}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer'
                }}
              >
                Supprimer mon potager
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2f6e31',
              marginBottom: '1rem'
            }}>Bienvenue dans Mon Potager Facile!</h2>
            <p style={{ marginBottom: '1.5rem' }}>Vous n'avez pas encore créé de potager. Commencez maintenant pour recevoir des recommandations personnalisées.</p>
            <Link href="/garden/create" style={{
              backgroundColor: '#3e8e41',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}>
              Créer mon potager
            </Link>
          </div>
        )}
        
        {garden && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#2f6e31'
              }}>Mes Plantes</h2>
              
              <Link href="/garden/plante/add" style={{
                backgroundColor: '#3e8e41',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}>
                Ajouter une plante
              </Link>
            </div>
            
            {garden.plantes && garden.plantes.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {garden.plantes.map((plante, index) => (
                  <div key={index} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    transition: 'box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      color: '#3e8e41',
                      marginBottom: '0.5rem'
                    }}>{plante.nom}</h3>
                    <p><strong>Plantation:</strong> {new Date(plante.date_plantation).toLocaleDateString()}</p>
                    {plante.arrosage_prochain && (
                      <p><strong>Prochain arrosage:</strong> {new Date(plante.arrosage_prochain).toLocaleDateString()}</p>
                    )}
                    {plante.recolte_estimee && (
                      <p><strong>Récolte estimée:</strong> {new Date(plante.recolte_estimee).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '2rem 0',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                Vous n'avez pas encore de plantes dans votre potager.
              </div>
            )}
          </div>
        )}

        {garden && (
          <Link href="/recommendations" style={{
            backgroundColor: '#3e8e41',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '1rem'
          }}>
            Voir les recommandations IA
          </Link>
        )}

      </div>
    </div>
  );
}