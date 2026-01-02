import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, uploadBuktiBayar } from '../services/bookingService';

const HistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk handle upload
  const [uploadingId, setUploadingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data.data || data); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleFileChange = (e, bookingId) => {
    const file = e.target.files[0];
    if (file) handleUpload(bookingId, file);
  };

  const handleUpload = async (bookingId, file) => {
      setUploadingId(bookingId); 
      try {
          await uploadBuktiBayar(bookingId, file);
          alert('Bukti pembayaran berhasil diupload! 📤');
          fetchBookings(); 
      } catch (error) {
          alert('Gagal upload bukti');
      } finally {
          setUploadingId(null);
      }
  };

  if (loading) return <div style={styles.loading}>Sedang memuat data...</div>;

  return (
    <div style={styles.container}>
      
      {/* HEADER: TOMBOL BACK & JUDUL */}
      <div style={styles.headerContainer}>
        <Link to="/rooms" style={styles.backBtn}>
            &larr; Kembali Cari Kamar
        </Link>
        <h1 style={styles.pageTitle}>Riwayat Sewa Saya</h1>
      </div>

      {bookings.length === 0 ? (
        <div style={styles.emptyState}>
            <p>Belum ada riwayat booking.</p>
            <Link to="/rooms" style={styles.ctaBtn}>Mulai Sewa Sekarang</Link>
        </div>
      ) : (
          <div style={styles.gridContainer}>
            {bookings.map(item => (
                <div key={item.id} style={styles.card}>
                    
                    {/* BAGIAN ATAS: NOMOR KAMAR & STATUS */}
                    <div style={styles.cardHeader}>
                        <div>
                            <h3 style={styles.roomTitle}>Kamar {item.Room?.nomor_kamar}</h3>
                            <span style={styles.roomType}>{item.Room?.tipe}</span>
                        </div>
                        <span style={{
                            ...styles.badge, 
                            backgroundColor: item.status_pembayaran === 'lunas' ? '#2ecc71' : 
                                             item.status_pembayaran === 'batal' ? '#e74c3c' : '#f1c40f'
                        }}>
                            {item.status_pembayaran.toUpperCase()}
                        </span>
                    </div>

                    <hr style={styles.divider}/>

                    {/* BAGIAN TENGAH: DETAIL */}
                    <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Tanggal Masuk</span>
                            <span style={styles.value}>{item.tanggal_masuk}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Durasi</span>
                            <span style={styles.value}>{item.durasi_bulan} Bulan</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.label}>Total Harga</span>
                            <span style={styles.priceValue}>Rp {item.total_harga.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {/* BAGIAN BAWAH: BUKTI PEMBAYARAN */}
                    <div style={styles.actionArea}>
                        {item.bukti_bayar ? (
                            <div style={styles.uploadedState}>
                                <span style={{display:'flex', alignItems:'center', gap:'5px'}}>
                                    ✅ Bukti Terkirim
                                </span>
                                <a 
                                    href={`http://localhost:5000/uploads/${item.bukti_bayar}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    style={styles.linkProof}
                                >
                                    Lihat Foto 👁️
                                </a>
                            </div>
                        ) : (
                            item.status_pembayaran === 'pending' && (
                                <div style={styles.uploadContainer}>
                                    <p style={styles.uploadInstruction}>Silakan transfer dan upload bukti untuk diproses.</p>
                                    <label style={uploadingId === item.id ? styles.uploadBtnDisabled : styles.uploadBtn}>
                                        {uploadingId === item.id ? 'Mengupload...' : '📤 Upload Bukti Transfer'}
                                        <input 
                                          type="file" 
                                          style={{display: 'none'}} 
                                          accept="image/*"
                                          onChange={(e) => handleFileChange(e, item.id)}
                                          disabled={uploadingId === item.id}
                                        />
                                    </label>
                                </div>
                            )
                        )}
                    </div>

                </div>
            ))}
          </div>
      )}
    </div>
  );
};

// --- STYLES MODERN ---
const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    loading: { textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666' },
    
    // Header
    headerContainer: { marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px' },
    backBtn: { textDecoration: 'none', color: '#3498db', fontWeight: 'bold', fontSize: '0.95rem', display: 'inline-block', marginBottom: '10px' },
    pageTitle: { margin: 0, color: '#333', fontSize: '2rem' },

    // Empty State
    emptyState: { textAlign: 'center', padding: '50px', backgroundColor: '#f9f9f9', borderRadius: '10px' },
    ctaBtn: { display: 'inline-block', marginTop: '10px', textDecoration: 'none', backgroundColor: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold' },

    // Card Layout
    gridContainer: { display: 'flex', flexDirection: 'column', gap: '25px' },
    card: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #eee' },
    
    // Card Header
    cardHeader: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#fff' },
    roomTitle: { margin: 0, fontSize: '1.4rem', color: '#2c3e50' },
    roomType: { color: '#7f8c8d', fontSize: '0.9rem', marginTop: '4px', display: 'block' },
    badge: { padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' },
    
    divider: { margin: 0, border: 'none', borderTop: '1px solid #f0f0f0' },

    // Detail Grid
    detailsGrid: { padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', backgroundColor: '#fafafa' },
    detailItem: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '0.8rem', color: '#95a5a6', marginBottom: '4px', textTransform: 'uppercase' },
    value: { fontSize: '1rem', color: '#34495e', fontWeight: '500' },
    priceValue: { fontSize: '1.1rem', color: '#27ae60', fontWeight: 'bold' },

    // Action Area (Upload)
    actionArea: { padding: '20px', backgroundColor: 'white', borderTop: '1px solid #f0f0f0' },
    
    // Upload State
    uploadContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
    uploadInstruction: { margin: 0, fontSize: '0.9rem', color: '#7f8c8d', fontStyle: 'italic' },
    uploadBtn: { backgroundColor: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', transition: '0.2s', boxShadow: '0 2px 5px rgba(52, 152, 219, 0.3)' },
    uploadBtnDisabled: { backgroundColor: '#bdc3c7', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'not-allowed', fontWeight: 'bold', fontSize: '0.9rem' },

    // Success State
    uploadedState: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e8f8f5', padding: '10px 15px', borderRadius: '8px', border: '1px solid #d1f2eb', color: '#27ae60', fontWeight: 'bold' },
    linkProof: { color: '#3498db', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px dotted #3498db' }
};

export default HistoryPage;