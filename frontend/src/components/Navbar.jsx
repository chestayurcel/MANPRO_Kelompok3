// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser(); // Ambil data user dari local storage

  const handleLogout = () => {
    logoutUser();
    alert('Anda berhasil logout');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* LOGO / BRAND */}
        <Link to="/" style={styles.brand}>
          🏠 Permata Kost
        </Link>

        {/* MENU KANAN */}
        <div style={styles.menu}>
            <Link to="/rooms" style={styles.link}>🏠 Daftar Kamar</Link>
          {user ? (
            // TAMPILAN JIKA SUDAH LOGIN
            <>
              <span style={styles.welcome}>Halo, <b>{user.nama}</b></span>
              
              {/* MENU KHUSUS PENGHUNI (Hanya muncul jika role = penghuni) */}
              {user.role === 'penghuni' && (
                <Link to="/history" style={styles.link}>Riwayat</Link> 
              )}

              {/* MENU KHUSUS ADMIN (Hanya muncul jika role = admin) */}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" style={{...styles.link, color: 'red'}}>Dashboard</Link>
              )}
              
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            // TAMPILAN JIKA BELUM LOGIN
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Styling Navbar
const styles = {
  nav: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '15px 0',
    marginBottom: '30px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  welcome: {
    color: '#555',
    fontSize: '1rem'
  },
  link: {
    textDecoration: 'none',
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: '5px' // Sedikit jarak
  },
  loginBtn: {
    textDecoration: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '5px',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Navbar;