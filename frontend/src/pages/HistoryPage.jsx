import React, { useEffect, useState } from 'react';
import { getMyBookings } from '../services/bookingService';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (error) {
        alert('Gagal memuat riwayat booking');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop: '50px'}}>Loading...</div>;

  return (
    <div style={styles.container}>
    <Link to="/" style={styles.backButton}>&larr; Kembali ke Home</Link>
      <h1 style={styles.title}>Riwayat Booking Saya</h1>
      
      {bookings.length === 0 ? (
        <p style={{textAlign: 'center'}}>Belum ada riwayat booking.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>No. Kamar</th>
              <th style={styles.th}>Tgl Masuk</th>
              <th style={styles.th}>Durasi</th>
              <th style={styles.th}>Total Harga</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={styles.tr}>
                <td style={styles.td}>{booking.Room ? booking.Room.nomor_kamar : 'Kamar Dihapus'}</td>
                <td style={styles.td}>{booking.tanggal_masuk}</td>
                <td style={styles.td}>{booking.durasi_bulan} Bulan</td>
                <td style={styles.td}>Rp {booking.total_harga.toLocaleString('id-ID')}</td>
                <td style={styles.td}>
                    <span style={styles.badge}>{booking.status_pembayaran}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  backButton: { display: 'inline-block', marginBottom: '20px', textDecoration: 'none', color: '#555', fontWeight: 'bold' },
  title: { marginBottom: '20px', textAlign: 'center', color: '#333' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  thead: { backgroundColor: '#3498db', color: 'white' },
  th: { padding: '12px', textAlign: 'left' },
  tr: { borderBottom: '1px solid #ddd' },
  td: { padding: '12px' },
  badge: { backgroundColor: '#f39c12', color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', textTransform: 'uppercase' }
};

export default HistoryPage;