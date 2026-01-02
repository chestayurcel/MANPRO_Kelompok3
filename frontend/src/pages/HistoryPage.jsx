import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, uploadBuktiBayar } from '../services/bookingService'; // Import upload

const HistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk handle upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null); // ID booking yang sedang diupload

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data.data || data); // Handle format response
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // Fungsi Handle File Change
  const handleFileChange = (e, bookingId) => {
    const file = e.target.files[0];
    if (file) {
        handleUpload(bookingId, file);
    }
  };

  // Fungsi Kirim Upload
  const handleUpload = async (bookingId, file) => {
      setUploadingId(bookingId); // Set loading status for this item
      try {
          await uploadBuktiBayar(bookingId, file);
          alert('Bukti pembayaran berhasil diupload!');
          fetchBookings(); // Refresh data
      } catch (error) {
          alert('Gagal upload bukti');
      } finally {
          setUploadingId(null);
      }
  };

  if (loading) return <div style={{padding:'20px'}}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1>📜 Riwayat Booking Saya</h1>
      {bookings.length === 0 ? <p>Belum ada riwayat booking.</p> : (
          bookings.map(item => (
              <div key={item.id} style={styles.card}>
                  <div style={styles.header}>
                      <h3>{item.Room?.nomor_kamar} - {item.Room?.tipe}</h3>
                      <span style={{
                          ...styles.badge, 
                          backgroundColor: item.status_pembayaran === 'lunas' ? '#2ecc71' : 
                                           item.status_pembayaran === 'batal' ? '#e74c3c' : '#f39c12'
                      }}>
                          {item.status_pembayaran.toUpperCase()}
                      </span>
                  </div>
                  <p>Check-in: {item.tanggal_masuk}</p>
                  <p>Durasi: {item.durasi_bulan} Bulan</p>
                  <p>Total: Rp {item.total_harga.toLocaleString('id-ID')}</p>

                  <hr style={{margin: '10px 0', border: 'none', borderTop: '1px solid #eee'}}/>

                  {/* AREA BUKTI PEMBAYARAN */}
                  <div style={{marginTop: '15px'}}>
                      <strong>Bukti Pembayaran: </strong>
                      
                      {item.bukti_bayar ? (
                          // Jika sudah ada bukti, tampilkan link/status
                          <div style={{marginTop: '5px', color: 'green'}}>
                              ✅ Sudah diupload
                              <br/>
                              <a href={`http://localhost:5000/uploads/${item.bukti_bayar}`} target="_blank" rel="noreferrer" style={{fontSize:'0.9rem', color: 'blue'}}>
                                  Lihat Bukti
                              </a>
                          </div>
                      ) : (
                          // Jika belum ada, tampilkan form upload
                          item.status_pembayaran === 'pending' && (
                              <div style={{marginTop: '5px'}}>
                                  <label style={styles.uploadBtn}>
                                      {uploadingId === item.id ? 'Mengupload...' : '📤 Upload Bukti Transfer'}
                                      <input 
                                        type="file" 
                                        style={{display: 'none'}} 
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, item.id)}
                                        disabled={uploadingId === item.id}
                                      />
                                  </label>
                                  <p style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>
                                      *Silakan transfer dan upload struk agar segera diproses.
                                  </p>
                              </div>
                          )
                      )}
                  </div>
              </div>
          ))
      )}
    </div>
  );
};

const styles = {
    card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    badge: { padding: '5px 10px', borderRadius: '15px', color: 'white', fontSize: '0.8rem', fontWeight: 'bold' },
    uploadBtn: {
        display: 'inline-block',
        backgroundColor: '#3498db',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    }
};

export default HistoryPage;