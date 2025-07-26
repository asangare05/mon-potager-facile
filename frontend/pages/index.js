import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  // Test pour voir si useRouter fonctionne
  const router = useRouter();
  
  // Test pour voir si useEffect fonctionne
  useEffect(() => {
    console.log("La page d'accueil est chargée");
  }, []);

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
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: '#2f6e31', 
        marginBottom: '1.5rem' 
      }}>
        Mon Potager Facile
      </h1>
      
      <p style={{ 
        fontSize: '1.25rem', 
        color: '#3e8e41', 
        marginBottom: '2rem', 
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        Créez votre potager personnalisé et recevez des recommandations intelligentes basées sur votre région et vos préférences.
      </p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem' 
      }}>
        {/* Utilisation de Link au lieu de a */}
        <Link href="/signup" 
          style={{ 
            backgroundColor: '#3e8e41', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Créer un compte
        </Link>
        
        {/* Utilisation de Link au lieu de a */}
        <Link href="/login" 
          style={{ 
            backgroundColor: 'white', 
            color: '#3e8e41', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none',
            fontWeight: '500',
            border: '1px solid #3e8e41'
          }}
        >
          Se connecter
        </Link>
      </div>
      
      {/* Bouton test pour vérifier si router.push fonctionne */}
      <button 
        onClick={() => router.push('/about')}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#f0f0f0',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Test de navigation
      </button>
    </div>
  );
}