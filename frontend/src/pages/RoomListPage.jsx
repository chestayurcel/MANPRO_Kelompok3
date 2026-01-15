// frontend/src/pages/RoomListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { getAllRooms } from '../services/roomService';
import { getCurrentUser } from '../services/authService';

// URL Ikon WhatsApp (Logo resmi)
const WA_ICON_URL = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser(); // Cek User

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllRooms(); // Panggil service
        setRooms(data); // Simpan ke state
      } catch (error) {
        alert('Gagal mengambil data kosan');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
          <h1 style={styles.title}>Daftar Kamar Tersedia</h1>
          
          {/* TOMBOL TAMBAH KAMAR (HANYA MUNCUL UNTUK ADMIN) */}
          {user && user.role === 'admin' && (
              <Link to="/admin/rooms/new" style={styles.addBtn}>
                  + Tambah Kamar Baru
              </Link>
          )}
      </div>
      
      <div style={styles.grid}>
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {/* --- TOMBOL WHATSAPP FLOATING (BARU) --- */}
      <a 
        // GANTI NOMOR DI SINI (Gunakan 62 bukan 08)
        href="https://wa.me/6282136221389?text=Halo%20Admin,%20saya%20tertarik%20dengan%20info%20kamar%20kost."
        target="_blank"
        rel="noopener noreferrer"
        style={styles.waButton}
        title="Chat via WhatsApp"
      >
        <img src={WA_ICON_URL} alt="WA" style={styles.waIcon} />
      </a>

    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px 80px 20px' }, // Padding bawah ditambah agar tidak tertutup tombol WA
  
  // Header container agar Judul dan Tombol Tambah bisa sejajar
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '2rem', color: '#333', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
  
  // Style Tombol Tambah
  addBtn: {
      backgroundColor: 'blue',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },

  // --- STYLE TOMBOL WA (BARU) ---
  waButton: {
    position: 'fixed',     // Agar melayang tetap di tempat saat scroll
    bottom: '30px',        // Jarak dari bawah
    right: '30px',         // Jarak dari kanan
    backgroundColor: '#25D366', // Warna Hijau WA
    width: '60px',
    height: '60px',
    borderRadius: '50%',   // Membuat bulat
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)', // Bayangan
    zIndex: 1000,          // Selalu di paling atas layer
    transition: 'transform 0.3s',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  waIcon: {
    width: '35px',
    height: '35px',
    filter: 'brightness(0) invert(1)' // Membuat ikon jadi putih
  }
};

export default RoomListPage;