// frontend/src/pages/RoomListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import { getAllRooms } from '../services/roomService';
import { getCurrentUser } from '../services/authService';

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
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px' },
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
  }
};

export default RoomListPage;