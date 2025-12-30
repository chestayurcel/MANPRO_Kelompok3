// frontend/src/components/RoomCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const RoomCard = ({ room }) => {
    const user = getCurrentUser();

  return (
    <div style={styles.card}>
      <img 
        src={room.foto_url || 'https://via.placeholder.com/300'} 
        alt={room.nomor_kamar} 
        style={styles.image} 
      />
      <div style={styles.content}>
        <div style={styles.header}>
            <h3 style={styles.title}>Kamar {room.nomor_kamar}</h3>
            <span style={room.status === 'tersedia' ? styles.badgeGreen : styles.badgeRed}>
                {room.status}
            </span>
        </div>
        <p style={styles.type}>{room.tipe}</p>
        <p style={styles.price}>Rp {room.harga_per_bulan.toLocaleString('id-ID')} / bulan</p>
        <p style={styles.facilities}>{room.fasilitas}</p>

        {user && user.role === 'admin' ? (
            // JIKA ADMIN: Tombolnya lari ke Edit Page
            <Link to={`/admin/rooms/edit/${room.id}`} style={{ textDecoration: 'none' }}>
                <button style={{...styles.button, backgroundColor: '#f39c12'}}>Edit Kamar</button>
            </Link>
        ) : (
            // JIKA BUKAN ADMIN: Tombolnya Lihat Detail
            <Link to={`/room/${room.id}`} style={{ textDecoration: 'none' }}>
                <button style={styles.button}>Lihat Detail</button>
            </Link>
        )}
        </div>
    </div>
  );
};

// Styling sederhana pakai object CSS (bisa diganti CSS modules nanti)
const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '15px',
  },
  header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  type: {
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '5px'
  },
  price: {
    color: '#2ecc71',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '10px',
  },
  facilities: {
      fontSize: '0.8rem',
      color: '#888',
      marginBottom: '15px'
  },
  badgeGreen: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem'
  },
  badgeRed: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default RoomCard;