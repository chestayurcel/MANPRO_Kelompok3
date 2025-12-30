// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const LandingPage = () => {
  const user = getCurrentUser();

  return (
    <div style={styles.heroContainer}>
      {/* Overlay Gelap agar teks terbaca */}
      <div style={styles.overlay}></div>

      <div style={styles.content}>
        <h1 style={styles.title}>Selamat Datang di Permata Kost</h1>
        <p style={styles.subtitle}>
          Hunian nyaman, strategis, dan fasilitas lengkap untuk mahasiswa dan profesional. 
          Temukan kamar impian Anda di sini.
        </p>

        <div style={styles.buttonGroup}>
          {/* Tombol Utama: Lihat Kamar */}
          <Link to="/rooms" style={styles.exploreBtn}>
            🔍 Jelajahi Kamar
          </Link>

          {/* Jika user BELUM login, tampilkan tombol Masuk & Daftar */}
          {!user && (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginBtn}>Masuk</Link>
              <Link to="/register" style={styles.registerBtn}>Daftar Akun</Link>
            </div>
          )}
        </div>

        {/* Fitur Unggulan Pendek */}
        <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>📍 Lokasi Strategis</div>
            <div style={styles.featureItem}>📶 WiFi Kencang</div>
            <div style={styles.featureItem}>🛡️ Keamanan 24 Jam</div>
            <div style={styles.featureItem}>🧹 Bersih & Nyaman</div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  heroContainer: {
    position: 'relative',
    height: '90vh', // Hampir layar penuh
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    // Ganti URL ini dengan foto kost asli nanti
    backgroundImage: 'url("https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1500")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginTop: '-30px' // Sedikit trik agar naik ke bawah navbar
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0, 0.6)' // Gelapkan background
  },
  content: {
    position: 'relative', // Agar di atas overlay
    zIndex: 1,
    maxWidth: '800px',
    padding: '20px'
  },
  title: {
    fontSize: '3.5rem',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '50px'
  },
  exploreBtn: {
    padding: '15px 40px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(52, 152, 219, 0.5)'
  },
  authButtons: {
    display: 'flex',
    gap: '15px'
  },
  loginBtn: {
    padding: '10px 25px',
    border: '2px solid white',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '20px',
    fontWeight: 'bold'
  },
  registerBtn: {
    padding: '10px 25px',
    backgroundColor: '#2ecc71',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '20px',
    fontWeight: 'bold'
  },
  featuresGrid: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap'
  },
  featureItem: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      padding: '10px 20px',
      borderRadius: '20px',
      fontSize: '0.9rem'
  }
};

export default LandingPage;