// frontend/src/components/RoomCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { deleteRoom } from '../services/roomService';

const RoomCard = ({ room }) => {
    const user = getCurrentUser();

    const handleDelete = async () => {
    if (window.confirm(`Yakin ingin menghapus Kamar ${room.nomor_kamar} selamanya?`)) {
      try {
        await deleteRoom(room.id);
        alert('Kamar berhasil dihapus');
        window.location.reload(); // Refresh halaman agar kartu hilang
      } catch (error) {
        alert('Gagal menghapus kamar');
      }
    }
  };

  const getBadgeStyle = (status) => {
      if (status === 'tersedia') return styles.badgeGreen;
      if (status === 'terisi') return styles.badgeRed;
      return styles.badgeYellow; // Untuk 'pending' atau 'perbaikan'
  };

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
            <span style={getBadgeStyle(room.status)}>
                {room.status.toUpperCase()}
            </span>
        </div>
        <p style={styles.type}>{room.tipe}</p>
        <p style={styles.price}>Rp {room.harga_per_bulan.toLocaleString('id-ID')} / bulan</p>
        <p style={styles.facilities}>{room.fasilitas}</p>

        {user && user.role === 'admin' ? (
          <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
            {/* TOMBOL ADMIN: Edit & Hapus */}
            <Link to={`/admin/rooms/edit/${room.id}`} style={{ textDecoration: 'none' }}>
                <button style={{...styles.button, backgroundColor: '#f39c12'}}>Edit Kamar</button>
            </Link>
            
            <button 
                onClick={handleDelete}
                style={{...styles.button, backgroundColor: '#c0392b', flex: 1}}
            >Hapus Kamar
            </button>
            </div>
        ) : (
            // TOMBOL BUKAN ADMIN(Penghuni): Lihat Detail
            <Link to={`/room/${room.id}`} style={{ textDecoration: 'none' }}>
                <button style={styles.button}>Lihat Detail</button>
            </Link>
        )}
        </div>
    </div>
  );
};

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
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem'
  },
  badgeRed: {
    backgroundColor: '#e74c3c',
    color: 'white', padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem'
  },
  badgeYellow: {
    backgroundColor: '#f1c40f',
    color: 'white', padding: '5px 10px',
    borderRadius: '15px', fontSize: '0.8rem'
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