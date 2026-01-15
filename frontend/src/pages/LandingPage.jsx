// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const LandingPage = () => {
  const user = getCurrentUser();

  // URL Maps dengan marker merah berdasarkan koordinat -7.892001, 110.041728
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3951.353322144344!2d110.0391530740523!3d-7.892000992130752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwNTMnMzEuMiJTIDExMMKwMDInMzAuMiJF!5e0!3m2!1sid!2sid!4v1715600000000!5m2!1sid!2sid";

  return (
    <div style={styles.pageWrapper}>
      {/* SECTION 1: HERO */}
      <section style={styles.heroContainer}>
        <div style={styles.overlay}></div>
        <div style={styles.content}>
          <h1 style={styles.title}>Selamat Datang di Permata Kost</h1>
          <p style={styles.subtitle}>
            Hunian nyaman, strategis, dan fasilitas lengkap untuk mahasiswa dan profesional.
            Temukan kamar impian Anda di sini.
          </p>

          <div style={styles.buttonGroup}>
            <Link to="/rooms" style={styles.exploreBtn}>
              🔍 Jelajahi Kamar
            </Link>
            {!user && (
              <div style={styles.authButtons}>
                <Link to="/login" style={styles.loginBtn}>Masuk</Link>
                <Link to="/register" style={styles.registerBtn}>Daftar Akun</Link>
              </div>
            )}
          </div>

          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>📍 Lokasi Strategis</div>
            <div style={styles.featureItem}>📶 WiFi Kencang</div>
            <div style={styles.featureItem}>🛡️ Keamanan 24 Jam</div>
            <div style={styles.featureItem}>🧹 Bersih & Nyaman</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LOKASI (Dua Kolom) */}
      <section style={styles.mapSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Lokasi Kami</h2>
          <p style={styles.mapSubtitle}>Kunjungi kami langsung untuk melihat fasilitas yang tersedia.</p>
          
          <div style={styles.flexLayout}>
            {/* Bagian Kiri: Maps */}
            <div style={styles.mapWrapper}>
              <iframe
                title="Lokasi Permata Kost"
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '15px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Bagian Kanan: Alamat */}
            <div style={styles.addressWrapper}>
              <div style={styles.addressCard}>
                <h3 style={styles.addressTitle}>Alamat Lengkap</h3>
                <p style={styles.addressText}>
                  Jalan Satuan Radar Congot, RT.001/RW.002, Pedukuhan, Jangkaran, Kec. Temon, 
                  Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta 55654
                </p>
                <div style={styles.divider}></div>
                <div style={styles.contactInfo}>
                  <p><strong>Operasional:</strong> 08:00 - 21:00 WIB</p>
                  <p><strong>Kontak:</strong> +6285742473422</p>
                </div>
                <a 
                  href="https://maps.google.com/maps?z=16&t=m&hl=id&gl=ID&mapclient=embed&q=7%C2%B053%2731.2%22S+110%C2%B002%2730.2%22E@-7.892001,110.041728" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.mapLink}
                >
                  Buka di Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 Permata Kost. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: { width: '100%', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', overflowX: 'hidden' },
  heroContainer: {
    position: 'relative', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', color: 'white', backgroundImage: 'url("https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1500")',
    backgroundSize: 'cover', backgroundPosition: 'center', margin: 0,
  },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0, 0.6)' },
  content: { position: 'relative', zIndex: 1, maxWidth: '850px', padding: '20px' },
  title: { fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '20px', fontWeight: 'bold' },
  subtitle: { fontSize: '1.2rem', marginBottom: '40px', lineHeight: '1.6' },
  buttonGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '50px' },
  exploreBtn: { padding: '15px 40px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold' },
  authButtons: { display: 'flex', gap: '15px' },
  loginBtn: { padding: '10px 25px', border: '2px solid white', color: 'white', textDecoration: 'none', borderRadius: '20px' },
  registerBtn: { padding: '10px 25px', backgroundColor: '#2ecc71', color: 'white', textDecoration: 'none', borderRadius: '20px' },
  featuresGrid: { display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' },
  featureItem: { backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', padding: '10px 20px', borderRadius: '25px', fontSize: '0.9rem' },
  
  // Gaya baru untuk Section Lokasi
  mapSection: { padding: '80px 20px', backgroundColor: '#f9f9f9' },
  container: { maxWidth: '1200px', margin: '0 auto', textAlign: 'center' },
  sectionTitle: { fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px', fontWeight: 'bold' },
  mapSubtitle: { color: '#7f8c8d', marginBottom: '50px' },
  flexLayout: { display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', justifyContent: 'center' },
  mapWrapper: { flex: '1 1 500px', minWidth: '300px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '15px', overflow: 'hidden' },
  addressWrapper: { flex: '1 1 400px', minWidth: '300px', textAlign: 'left' },
  addressCard: { backgroundColor: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  addressTitle: { fontSize: '1.5rem', color: '#2c3e50', marginBottom: '20px', fontWeight: 'bold' },
  addressText: { fontSize: '1.1rem', color: '#34495e', lineHeight: '1.8', marginBottom: '20px' },
  divider: { height: '2px', backgroundColor: '#3498db', width: '50px', marginBottom: '20px' },
  contactInfo: { marginBottom: '30px', fontSize: '0.95rem', color: '#7f8c8d' },
  mapLink: { display: 'inline-block', padding: '12px 25px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', transition: '0.3s' },
  
  footer: { padding: '30px', textAlign: 'center', backgroundColor: '#2c3e50', color: '#bdc3c7' }
};

export default LandingPage;