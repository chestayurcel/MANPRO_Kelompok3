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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Daftar Kamar Permata Kost</h1>

      {user && user.role === 'admin' && (
          <Link to="/admin/rooms/new" style={styles.addBtn}>
              + Tambah Kamar Baru
          </Link>
      )}
      
      
      <div style={gridStyle}>
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Responsif grid
  gap: '20px',
};

export default RoomListPage;