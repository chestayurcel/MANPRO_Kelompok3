// frontend/src/pages/DetailRoomPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getRoomDetail } from '../services/roomService'; 
import { getCurrentUser } from '../services/authService';

const DetailRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Inisialisasi navigasi
  const user = getCurrentUser();  // Ambil data user

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Ambil Data Detail Kamar
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getRoomDetail(id);
        setRoom(data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
        // Tampilkan error di console saja, jangan alert terus menerus saat loading
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 2. Fungsi Handle Booking
  const handleBooking = async (e) => {
    if (e) e.preventDefault(); // Cegah reload halaman

    // Cek Login
    if (!user) {
        alert('Silakan login terlebih dahulu.');
        navigate('/login');
        return;
    }

    // Konfirmasi
    const isConfirmed = window.confirm(`Yakin sewa kamar ${room.nomor_kamar}?`);
    if (!isConfirmed) return;

    // Kirim ke Backend
    try {
        const token = localStorage.getItem('token');
        
        await axios.post('http://localhost:5000/api/bookings', {
            roomId: room.id,
            tanggal_masuk: new Date(),
            durasi_bulan: 1 
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        alert('Booking Berhasil! 🎉');
        navigate('/rooms'); // Pindah ke Home

    } catch (error) {
        console.error("Error Booking:", error);
        const pesan = error.response?.data?.message || error.message;
        alert('Gagal Booking: ' + pesan);
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading Detail...</div>;
  if (!room) return <div style={{textAlign:'center'}}>Data Kosong / Kamar Tidak Ditemukan</div>;

  return (
    <div style={styles.container}>
      <Link to="/rooms" style={styles.backButton}>&larr; Kembali</Link>
      
      <div style={styles.grid}>
        {/* Kolom Kiri: Foto */}
        <div style={styles.imageContainer}>
             <img src={room.foto_url || 'https://via.placeholder.com/400'} alt={room.nomor_kamar} style={styles.image} />
        </div>

        {/* Kolom Kanan: Info */}
        <div style={styles.infoContainer}>
            <h1 style={styles.title}>Kamar {room.nomor_kamar}</h1>
            <span style={styles.badge}>{room.tipe}</span>
            
            <h2 style={styles.price}>Rp {room.harga_per_bulan.toLocaleString('id-ID')} / bulan</h2>
            
            <div style={styles.divider}></div>
            
            <h3>Fasilitas:</h3>
            <p style={styles.desc}>{room.fasilitas}</p>

            <div style={styles.divider}></div>

            <h3>Status:</h3>
            <p style={{color: room.status === 'tersedia' ? 'green' : 'red', fontWeight: 'bold'}}>
                {room.status.toUpperCase()}
            </p>

            {/* Tombol Aksi */}
            {/* Jika User adalah ADMIN, Tampilkan tombol Edit atau Hilangkan sama sekali */}
            {user && user.role === 'admin' ? (
                <div style={{marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center', border: '1px solid #ddd'}}>
                    <p style={{color: '#555', marginBottom: '10px'}}>Anda melihat halaman ini sebagai <b>Admin</b>.</p>
                    <button 
                        onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}
                        style={{padding: '10px 20px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                    >
                        Edit Kamar Ini
                    </button>
                </div>
            ) : (
                // JIKA PENGHUNI / BELUM LOGIN: Tampilkan tombol Sewa seperti biasa
                <button 
                    style={{
                        ...styles.bookButton, 
                        backgroundColor: room.status === 'tersedia' ? '#3498db' : '#ccc',
                        cursor: room.status === 'tersedia' ? 'pointer' : 'not-allowed'
                    }} 
                    disabled={room.status !== 'tersedia'}
                    onClick={handleBooking} 
                >
                    {room.status === 'tersedia' ? 'Ajukan Sewa Sekarang' : 'Kamar Penuh'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  backButton: { display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#555', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }, 
  imageContainer: { borderRadius: '10px', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover', minHeight: '400px' },
  infoContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  title: { fontSize: '2.5rem', marginBottom: '10px' },
  badge: { backgroundColor: '#eee', padding: '5px 15px', borderRadius: '20px', width: 'fit-content', marginBottom: '15px' },
  price: { color: '#2ecc71', fontSize: '2rem', marginBottom: '20px' },
  desc: { lineHeight: '1.6', color: '#666' },
  divider: { height: '1px', backgroundColor: '#eee', margin: '20px 0' },
  bookButton: { marginTop: '30px', padding: '15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' }
};

export default DetailRoomPage;