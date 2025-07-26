// utils/styles.js
export const commonStyles = {
  page: {
    minHeight: '100vh', 
    backgroundColor: '#f0f9f0', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '1rem'
  },
  card: {
    backgroundColor: 'white', 
    padding: '2rem', 
    borderRadius: '0.5rem', 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
    width: '100%',
    maxWidth: '400px'
  },
  heading: {
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    color: '#2f6e31', 
    marginBottom: '1.5rem' 
  },
  error: {
    backgroundColor: '#fee2e2', 
    border: '1px solid #ef4444', 
    color: '#b91c1c', 
    padding: '0.75rem 1rem', 
    borderRadius: '0.25rem', 
    marginBottom: '1rem' 
  },
  inputGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block', 
    color: '#4b5563', 
    fontSize: '0.875rem', 
    fontWeight: '500', 
    marginBottom: '0.5rem' 
  },
  input: {
    width: '100%', 
    padding: '0.5rem 0.75rem', 
    border: '1px solid #d1d5db', 
    borderRadius: '0.25rem', 
    fontSize: '1rem' 
  },
  button: {
    width: '100%',
    backgroundColor: '#3e8e41', 
    color: 'white', 
    padding: '0.75rem', 
    borderRadius: '0.25rem', 
    fontWeight: '500',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer'
  },
  linkContainer: {
    marginTop: '1rem', 
    textAlign: 'center'
  },
  link: {
    color: '#3e8e41', 
    textDecoration: 'none'
  }
};