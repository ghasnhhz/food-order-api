import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenu, logoutUser, getCurrentUser } from './api';

function Menu() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user info
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    // Fetch menu
    fetchMenu();
  }, [navigate]);

  const fetchMenu = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getMenu();
      
      if (result.success) {
        setMenu(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
      // Even if logout API fails, navigate to login
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading menu...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem'
      }}>
        <div>
          <h1>Food Menu</h1>
          {user && <p>Welcome, {user.username}!</p>}
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '1rem', 
          marginBottom: '1rem',
          borderRadius: '4px'
        }}>
          {error}
          <button 
            onClick={fetchMenu}
            style={{
              marginLeft: '1rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Menu Items */}
      {menu.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {menu.map((item) => (
            <div 
              key={item._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                color: '#28a745',
                margin: '0'
              }}>
                {item.price}
              </p>
              <button
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => alert(`Added ${item.name} to cart!`)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>No menu items found</h3>
          </div>
        )
      )}
    </div>
  );
}

export default Menu;