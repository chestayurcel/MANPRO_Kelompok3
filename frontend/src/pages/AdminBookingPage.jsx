import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../services/bookingService';
import { Link } from 'react-router-dom';

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  const handleStatusChange = async (id, status, userName) => {
    const action = status === 'lunas' ? 'MENYETUJUI' : 'MENOLAK';
    if (window.confirm(`Yakin ingin ${action} booking dari ${userName}?`)) {
        try {
            await updateBookingStatus(id, status);
            fetchBookings(); 
        } catch (error) {
            alert('Gagal update status');
        }
    }
  };

  // --- FUNGSI HITUNG TANGGAL SELESAI ---
  const hitungTanggalSelesai = (tanggalMasuk, durasi) => {
      if (!tanggalMasuk || !durasi) return '-';
      
      const date = new Date(tanggalMasuk);
      // Tambahkan bulan sesuai durasi
      date.setMonth(date.getMonth() + parseInt(durasi));
      
      // Format ke Indonesia (DD MMMM YYYY)
      return date.toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
      });
  };

  // Helper untuk menampilkan bukti bayar
  const renderBukti = (item) => {
      if (!item.bukti_bayar) return <span style={{color:'#999', fontSize:'0.8rem'}}>Belum upload</span>;
      
      if (item.bukti_bayar === 'OFFLINE_TRANSACTION' || item.bukti_bayar === 'OFFLINE_BOOKING') {
          return <span style={styles.badgeOffline}>🏢 Offline</span>;
      }

      return (
          <a href={`http://localhost:5000/uploads/${item.bukti_bayar}`} target="_blank" rel="noreferrer">
              <img 
                src={`http://localhost:5000/uploads/${item.bukti_bayar}`} 
                alt="Bukti" 
                style={styles.thumbnail}
                onError={(e) => {e.target.style.display='none'}}
              />
          </a>
      );
  };

  return (
    <div style={styles.container}>
      
      <Link to="/rooms" style={styles.btnBack}>&larr; Kembali ke Daftar Kamar</Link>

      <h2 style={{marginTop: '10px', marginBottom: '20px'}}>📋 Persetujuan Booking Masuk</h2>
      
      <div style={{overflowX: 'auto'}}>
        <table style={styles.table}>
            <thead style={{ background: '#34495e', color: 'white' }}>
            <tr>
                <th style={styles.th}>Pemesan</th>
                <th style={styles.th}>Kamar</th>
                <th style={styles.th}>Tgl Masuk</th>
                <th style={styles.th}>Tgl Selesai</th> {/* KOLOM BARU */}
                <th style={styles.th}>Bukti Bayar</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
            </tr>
            </thead>
            <tbody>
            {bookings.length > 0 ? (
                bookings.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    
                    {/* 1. PEMESAN */}
                    <td style={styles.td}>
                        <div style={{fontWeight:'bold'}}>{item.User ? item.User.nama : 'User Dihapus'}</div>
                        <div style={{fontSize:'0.85rem', color:'#666'}}>{item.User?.no_hp}</div>
                    </td>

                    {/* 2. KAMAR */}
                    <td style={styles.td}>
                        <span style={styles.roomBadge}>{item.Room ? item.Room.nomor_kamar : '???'}</span>
                    </td>

                    {/* 3. TGL MASUK */}
                    <td style={styles.td}>
                        {item.tanggal_masuk}
                    </td>

                    {/* 4. TGL SELESAI (NEW) */}
                    <td style={styles.td}>
                        <span style={{color: '#2980b9', fontWeight: '500'}}>
                            {hitungTanggalSelesai(item.tanggal_masuk, item.durasi_bulan)}
                        </span>
                        <div style={{fontSize:'0.75rem', color:'#888'}}>
                            ({item.durasi_bulan} Bulan)
                        </div>
                    </td>

                    {/* 5. BUKTI BAYAR */}
                    <td style={styles.td}>
                        {renderBukti(item)}
                    </td>

                    {/* 6. STATUS */}
                    <td style={styles.td}>
                        <span style={{
                            padding: '5px 10px', 
                            borderRadius: '20px', 
                            color: 'white', 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold',
                            backgroundColor: 
                                item.status_pembayaran === 'lunas' ? '#2ecc71' : 
                                item.status_pembayaran === 'batal' ? '#e74c3c' : '#f1c40f'
                        }}>
                            {item.status_pembayaran.toUpperCase()}
                        </span>
                    </td>

                    {/* 7. AKSI (UPDATED) */}
                    <td style={styles.td}>
                        {item.status_pembayaran === 'pending' ? (
                            <div style={{display:'flex', gap:'5px'}}>
                                <button 
                                    onClick={() => handleStatusChange(item.id, 'lunas', item.User?.nama)}
                                    title="Setujui"
                                    style={styles.btnApprove}>✓</button>
                                <button 
                                    onClick={() => handleStatusChange(item.id, 'batal', item.User?.nama)}
                                    title="Tolak"
                                    style={styles.btnReject}>✕</button>
                            </div>
                        ) : (
                            // LOGIKA TEXT DISETUJUI / DITOLAK
                            <span style={{
                                fontWeight: 'bold',
                                color: item.status_pembayaran === 'lunas' ? '#2ecc71' : '#e74c3c'
                            }}>
                                {item.status_pembayaran === 'lunas' ? '✅ Disetujui' : '❌ Ditolak'}
                            </span>
                        )}
                    </td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan="7" style={{padding:'20px', textAlign:'center'}}>Belum ada data.</td></tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

// --- CSS ---
const styles = {
    container: { maxWidth: '1100px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' },
    table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', backgroundColor: 'white' },
    th: { padding: '15px', textAlign: 'left', fontSize: '0.9rem' },
    td: { padding: '15px', verticalAlign: 'middle', fontSize: '0.95rem' },
    
    thumbnail: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' },
    
    btnBack: { display: 'inline-block', marginBottom: '10px', textDecoration: 'none', color: '#555', fontWeight: 'bold' },
    roomBadge: { backgroundColor: '#eaf2f8', color: '#2980b9', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' },
    badgeOffline: { backgroundColor: '#95a5a6', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' },
    
    btnApprove: { padding: '8px 12px', background: '#2ecc71', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnReject: { padding: '8px 12px', background: '#e74c3c', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AdminBookingPage;