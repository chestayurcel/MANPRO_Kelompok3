import React, { useEffect, useState } from 'react';
import { getAllBookings, updateBookingStatus } from '../services/bookingService';
import { getAllRooms } from '../services/roomService';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_BASE_URL from '../config/api';

// Helper function to get base URL for uploads
const getBaseURL = () => API_BASE_URL.replace('/api', '');

// Import delete function (need to add to bookingService.js frontend)
const deleteBooking = async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) throw new Error('Gagal hapus booking');
    return response.json();
};

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);
<<<<<<< HEAD

  useEffect(() => { fetchBookings(); }, []);
=======
  const [rooms, setRooms] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({ tanggal_masuk: '', durasi_bulan: '', roomId: '' });

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data);
    } catch (error) {
      console.error("Gagal ambil data rooms:", error);
    }
  };
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3

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
<<<<<<< HEAD
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
      
=======
    const result = await Swal.fire({
      title: `Yakin ingin ${action} booking dari ${userName}?`,
      text: 'Tindakan ini akan mengubah status booking.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjut',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2ecc71',
      cancelButtonColor: '#95a5a6'
    });

    if (result.isConfirmed) {
      try {
        await updateBookingStatus(id, status);
        fetchBookings();
        fetchRooms();
        Swal.fire('Berhasil!', `Booking telah ${status === 'lunas' ? 'disetujui' : 'ditolak'}.`, 'success');
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat update status.', 'error');
      }
    }
  };

  const handleDelete = async (id, userName) => {
    const result = await Swal.fire({
      title: `Yakin ingin MENGHAPUS booking dari ${userName}?`,
      text: 'Tindakan ini tidak bisa dibatalkan dan akan membebaskan kamar.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6'
    });

    if (result.isConfirmed) {
      try {
        await deleteBooking(id);
        fetchBookings();
        fetchRooms();
        Swal.fire('Terhapus!', 'Booking telah dihapus dan kamar dibebaskan.', 'success');
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus booking.', 'error');
      }
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      tanggal_masuk: booking.tanggal_masuk,
      durasi_bulan: booking.durasi_bulan,
      roomId: booking.roomId
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${editingBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });
      if (!response.ok) throw new Error('Gagal update');
      setShowEditModal(false);
      fetchBookings();
      fetchRooms(); // Refresh room list after edit
    } catch (error) {
      alert('Gagal edit booking');
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
          <a href={`${getBaseURL()}/uploads/${item.bukti_bayar}`} target="_blank" rel="noreferrer">
              <img
                src={`${getBaseURL()}/uploads/${item.bukti_bayar}`}
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
      
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3
      <div style={{overflowX: 'auto'}}>
        <table style={styles.table}>
            <thead style={{ background: '#34495e', color: 'white' }}>
            <tr>
<<<<<<< HEAD
                <th style={styles.th}>Pemesan</th>
                <th style={styles.th}>Kamar</th>
                <th style={styles.th}>Tgl Masuk</th>
                <th style={styles.th}>Tgl Selesai</th> {/* KOLOM BARU */}
                <th style={styles.th}>Bukti Bayar</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
=======
                <th style={styles.th}>Pemesan</th><th style={styles.th}>Kamar</th><th style={styles.th}>Tgl Masuk</th><th style={styles.th}>Tgl Selesai</th><th style={styles.th}>Bukti Bayar</th><th style={styles.th}>Status</th><th style={styles.th}>Aksi</th>
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3
            </tr>
            </thead>
            <tbody>
            {bookings.length > 0 ? (
                bookings.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
<<<<<<< HEAD
                    
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
=======
                        <td style={styles.td}>
                            <div style={{fontWeight:'bold'}}>{item.User ? item.User.nama : 'User Dihapus'}</div>
                            <div style={{fontSize:'0.85rem', color:'#666'}}>{item.User?.no_hp}</div>
                        </td>
                        <td style={styles.td}>
                            <span style={styles.roomBadge}>{item.Room ? item.Room.nomor_kamar : '???'}</span>
                        </td>
                        <td style={styles.td}>
                            {item.tanggal_masuk}
                        </td>
                        <td style={styles.td}>
                            <span style={{color: '#2980b9', fontWeight: '500'}}>
                                {hitungTanggalSelesai(item.tanggal_masuk, item.durasi_bulan)}
                            </span>
                            <div style={{fontSize:'0.75rem', color:'#888'}}>
                                ({item.durasi_bulan} Bulan)
                            </div>
                        </td>
                        <td style={styles.td}>
                            {renderBukti(item)}
                        </td>
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
                        <td style={styles.td}>
                            <div style={{display:'flex', gap:'5px', alignItems:'center'}}>
                                {item.status_pembayaran === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange(item.id, 'lunas', item.User?.nama)}
                                            title="Setujui"
                                            style={styles.btnApprove}>✓</button>
                                        <button
                                            onClick={() => handleStatusChange(item.id, 'batal', item.User?.nama)}
                                            title="Tolak"
                                            style={styles.btnReject}>✕</button>
                                    </>
                                ) : (
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: item.status_pembayaran === 'lunas' ? '#2ecc71' : '#e74c3c'
                                    }}>
                                        {item.status_pembayaran === 'lunas' ? '✅ Disetujui' : '❌ Ditolak'}
                                    </span>
                                )}
                                <button
                                    onClick={() => handleEdit(item)}
                                    title="Edit Booking"
                                    style={styles.btnEdit}>✏️</button>
                                <button
                                    onClick={() => handleDelete(item.id, item.User?.nama)}
                                    title="Hapus Booking"
                                    style={styles.btnDelete}>🗑️</button>
                            </div>
                        </td>
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3
                    </tr>
                ))
            ) : (
                <tr><td colSpan="7" style={{padding:'20px', textAlign:'center'}}>Belum ada data.</td></tr>
            )}
            </tbody>
        </table>
      </div>
<<<<<<< HEAD
=======

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit Booking</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <label>Kamar:</label>
              <select
                value={editForm.roomId}
                onChange={(e) => setEditForm({ ...editForm, roomId: parseInt(e.target.value) })}
                style={styles.input}
                required
              >
                {/* Include current room if not available */}
                {rooms.filter(room => room.status === 'tersedia' || room.id === editingBooking.roomId).map(room => (
                  <option key={room.id} value={room.id}>
                    {room.nomor_kamar} - {room.tipe} (Rp {room.harga_per_bulan.toLocaleString('id-ID')}) {room.status !== 'tersedia' ? '(Sedang Terisi)' : ''}
                  </option>
                ))}
              </select>
              <label>Tanggal Masuk:</label>
              <input
                type="date"
                value={editForm.tanggal_masuk}
                onChange={(e) => setEditForm({ ...editForm, tanggal_masuk: e.target.value })}
                style={styles.input}
                required
              />
              <label>Durasi Bulan:</label>
              <input
                type="number"
                value={editForm.durasi_bulan}
                onChange={(e) => setEditForm({ ...editForm, durasi_bulan: parseInt(e.target.value) })}
                style={styles.input}
                required
              />
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.btnSave}>Simpan</button>
                <button type="button" onClick={() => setShowEditModal(false)} style={styles.btnCancel}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3
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
<<<<<<< HEAD
    
    btnApprove: { padding: '8px 12px', background: '#2ecc71', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnReject: { padding: '8px 12px', background: '#e74c3c', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
=======

    btnApprove: { padding: '8px 12px', background: '#2ecc71', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnReject: { padding: '8px 12px', background: '#e74c3c', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnEdit: { padding: '8px 12px', background: '#f39c12', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    btnDelete: { padding: '8px 12px', background: '#95a5a6', color: 'white', border:'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },

    // Modal styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { background: 'white', padding: '20px', borderRadius: '10px', width: '400px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
    input: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '5px' },
    modalButtons: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
    btnSave: { padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    btnCancel: { padding: '10px 20px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
>>>>>>> de57c666616990a80c38fa833bca6d9d0e36dba3
};

export default AdminBookingPage;