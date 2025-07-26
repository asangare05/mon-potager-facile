import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../utils/api';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState(null);
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. D'abord, récupérer les informations du potager
        const gardenResponse = await api.get('/garden');
        setGarden(gardenResponse.data);
        
        // 2. Ensuite, récupérer les recommandations
        console.log("Récupération des recommandations...");
        const recommendationsResponse = await api.get('/recommendations');
        console.log("Réponse reçue:", recommendationsResponse.data);
        
        setRecommendations(recommendationsResponse.data.recommendations);
        setIsFallback(recommendationsResponse.data.fallback || false);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        if (err.response?.status === 404) {
          setError("Impossible de charger les recommandations. Assurez-vous d'avoir créé un potager.");
        } else {
          setError("Une erreur est survenue lors de la récupération des recommandations. Veuillez réessayer plus tard.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
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
          onClick={handleLogout}
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
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: '#2f6e31',
          marginBottom: '1.5rem'
        }}>Recommandations personnalisées pour votre potager</h1>
        
        {/* Afficher les informations sur le potager */}
        {garden && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#2f6e31',
              marginBottom: '0.5rem'
            }}>Votre potager</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <p><strong>Région:</strong> {garden.region}</p>
                <p><strong>Surface:</strong> {garden.surface_m2} m²</p>
                <p><strong>Type de culture:</strong> {garden.type_culture}</p>
              </div>
              <div>
                <p><strong>Arrosage:</strong> {garden.arrosage}</p>
                <p><strong>Niveau:</strong> {garden.niveau}</p>
                <p><strong>Plantes:</strong> {garden.plantes?.length || 0}</p>
              </div>
            </div>
            
            {garden.plantes && garden.plantes.length > 0 && (
              <div>
                <p><strong>Vos plantes actuelles:</strong></p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  {garden.plantes.map((plante, index) => (
                    <span key={index} style={{
                      backgroundColor: '#f0f9f0',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.9rem'
                    }}>
                      {plante.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {recommendations && recommendations.source === 'openai' && (
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            display: 'inline-block'
          }}>
            <span style={{ 
              fontSize: '0.8rem',
              color: '#0066cc'
            }}>
              Recommandations générées par IA
            </span>
          </div>
        )}
        
        {isFallback && (
          <div style={{
            backgroundColor: '#fff8e6',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            display: 'inline-block'
          }}>
            <span style={{ 
              fontSize: '0.8rem',
              color: '#b38600'
            }}>
              Recommandations générées localement
            </span>
          </div>
        )}
        
        {loading ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <p>Chargement des recommandations personnalisées...</p>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: '0.25rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/dashboard" style={{
                color: '#3e8e41',
                textDecoration: 'none'
              }}>
                Retour au tableau de bord
              </Link>
            </div>
          </div>
        ) : recommendations ? (
          <>
            {/* Plantes recommandées */}
            {recommendations.recommendedPlants && Array.isArray(recommendations.recommendedPlants) && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2f6e31',
                  marginBottom: '0.5rem'
                }}>Plantes recommandées pour cette saison</h2>
                
                <p style={{ marginBottom: '1rem' }}>
                  {recommendations.seasonalTips || 'Voici quelques plantes recommandées pour la saison actuelle.'}
                </p>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {recommendations.recommendedPlants.map((plant, index) => (
                    <div key={index} style={{
                      backgroundColor: '#eaf5ea',
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.9rem'
                    }}>
                      {plant}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Plantes compagnes recommandées */}
            {recommendations.companionPlants && Array.isArray(recommendations.companionPlants) && recommendations.companionPlants.length > 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2f6e31',
                  marginBottom: '0.5rem'
                }}>Plantes compagnes recommandées</h2>
                
                <p style={{ marginBottom: '1rem' }}>
                  Ces plantes se marient bien avec celles que vous cultivez déjà et peuvent améliorer votre potager.
                </p>
                
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {recommendations.companionPlants.map((plant, index) => (
                    <div key={index} style={{
                      backgroundColor: '#fff0e6',
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.9rem',
                      color: '#994d00'
                    }}>
                      {plant}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Conseils pour les plantes existantes */}
            {recommendations.plantCareAdvice && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2f6e31',
                  marginBottom: '0.5rem'
                }}>Conseils pour vos plantes actuelles</h2>
                
                <p>{recommendations.plantCareAdvice}</p>
              </div>
            )}
            
            {/* Conseils d'arrosage */}
            {recommendations.wateringAdvice && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2f6e31',
                  marginBottom: '0.5rem'
                }}>Conseil d'arrosage</h2>
                
                <p>{recommendations.wateringAdvice}</p>
              </div>
            )}
            
            {/* Conseils d'espace et de culture */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {recommendations.spaceAdvice && (
                <div style={{ marginBottom: '1rem' }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#2f6e31',
                    marginBottom: '0.5rem'
                  }}>Utilisation optimale de l'espace</h2>
                  
                  <p>{recommendations.spaceAdvice}</p>
                </div>
              )}
              
              {recommendations.cultureAdvice && (
                <div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#2f6e31',
                    marginBottom: '0.5rem'
                  }}>Conseils pour votre type de culture</h2>
                  
                  <p>{recommendations.cultureAdvice}</p>
                </div>
              )}
            </div>
            
            {/* Conseils généraux */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {recommendations.experienceAdvice && (
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#2f6e31',
                  marginBottom: '0.5rem'
                }}>Conseils adaptés à votre expérience</h2>
              )}
              
              {recommendations.experienceAdvice && <p>{recommendations.experienceAdvice}</p>}
              
              {recommendations.generalAdvice && (
                <p style={{ marginTop: '1rem' }}>{recommendations.generalAdvice}</p>
              )}
            </div>
            
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              marginBottom: '2rem'
            }}>
              <Link href="/dashboard" style={{
                backgroundColor: '#3e8e41',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Retour au tableau de bord
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}