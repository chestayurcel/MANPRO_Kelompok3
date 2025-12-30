import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../services/bookingService';
import { Link } from 'react-router-dom';

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      alert('Gagal mengambil data booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Fungsi Handle Approval
  const handleStatusChange = async (id, status, userName) => {
    const action = status === 'lunas' ? 'MENYETUJUI' : 'MENOLAK';
    if (window.confirm(`Yakin ingin ${action} booking dari ${userName}?`)) {
        try {
            await updateBookingStatus(id, status);
            alert('Status berhasil diperbarui!');
            fetchBookings(); // Refresh tabel otomatis
        } catch (error) {
            alert('Gagal update status');
        }
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      
      {/* 2. TOMBOL KEMBALI */}
      <Link to="/rooms" style={btnBack}>&larr; Kembali ke Daftar Kamar</Link>

      <h1 style={{marginTop: '10px'}}>📋 Persetujuan Booking Masuk</h1>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr>
            <th style={p}>Pemesan</th>
            <th style={p}>Kamar</th>
            <th style={p}>Tanggal Masuk</th>
            <th style={p}>Status</th>
            <th style={p}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd', background: 'white' }}>
              <td style={p}>
                <strong>{item.User ? item.User.nama : 'User Dihapus'}</strong><br/>
                <small style={{color:'#666'}}>{item.User?.no_hp}</small>
              </td>
              <td style={p}>{item.Room ? item.Room.nomor_kamar : '???'}</td>
              <td style={p}>{item.tanggal_masuk}</td>
              <td style={p}>
                {/* Badge Status */}
                <span style={{
                    padding: '5px 10px', borderRadius: '15px', color: 'white', fontSize: '0.8rem', fontWeight: 'bold',
                    backgroundColor: item.status_pembayaran === 'lunas' ? '#2ecc71' : 
                                     item.status_pembayaran === 'batal' ? '#e74c3c' : '#f39c12'
                }}>
                    {item.status_pembayaran.toUpperCase()}
                </span>
              </td>
              <td style={p}>
                {/* Tombol Aksi hanya muncul jika status masih PENDING */}
                {item.status_pembayaran === 'pending' && (
                    <div style={{display:'flex', gap:'10px'}}>
                        <button 
                            onClick={() => handleStatusChange(item.id, 'lunas', item.User?.nama)}
                            style={btnApprove}>✅ Setuju</button>
                        <button 
                            onClick={() => handleStatusChange(item.id, 'batal', item.User?.nama)}
                            style={btnReject}>❌ Tolak</button>
                    </div>
                )}
                {item.status_pembayaran !== 'pending' && <span style={{color:'#888'}}>Selesai</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const p = { padding: '15px', textAlign: 'left', verticalAlign: 'middle' };
// 3. STYLE TOMBOL BACK
const btnBack = { display: 'inline-block', marginBottom: '10px', textDecoration: 'none', color: '#555', fontWeight: 'bold', fontSize: '1rem' };

const btnApprove = { padding: '8px 12px', background: '#2ecc71', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const btnReject = { padding: '8px 12px', background: '#e74c3c', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default AdminBookingPage;