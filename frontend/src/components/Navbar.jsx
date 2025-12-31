import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/authService';
import { getAllBookings } from '../services/bookingService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Agar navbar ter-update saat pindah halaman
  const user = getCurrentUser();

  // State untuk menghitung jumlah pending
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // --- EFEK UNTUK CEK NOTIFIKASI (KHUSUS ADMIN) ---
  useEffect(() => {
    // Hanya jalankan jika user adalah ADMIN
    if (user && user.role === 'admin') {
        const fetchNotification = async () => {
            try {
                const data = await getAllBookings();
                // Hitung berapa yang statusnya 'pending'
                const count = data.filter(item => item.status_pembayaran === 'pending').length;
                setPendingCount(count);
            } catch (error) {
                console.error("Gagal mengambil notifikasi");
            }
        };

        fetchNotification();

        // (Opsional) Cek otomatis setiap 5 detik agar realtime
        const interval = setInterval(fetchNotification, 5000);
        return () => clearInterval(interval);
    }
  }, [user, location.pathname]); // Update saat user berubah atau pindah halaman

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to={user ? "/rooms" : "/"} style={styles.brand}>
          🏠 Permata Kost
        </Link>

        <div style={styles.menu}>
          {user ? (
            <>
              <span style={styles.welcome}>Halo, <b>{user.nama}</b></span>
              
              {/* Menu Penghuni */}
              {user.role === 'penghuni' && (
                <Link to="/history" style={styles.link}>Riwayat</Link> 
              )}

              {/* Menu Admin */}
              {user.role === 'admin' && (
                <>
                  {/* --- 3. MODIFIKASI MENU PESANAN DENGAN BADGE --- */}
                  <Link to="/admin/bookings" style={styles.linkContainer}>
                    📄 Booking/Pesanan
                    {pendingCount > 0 && (
                        <span style={styles.notificationBadge}>
                            {pendingCount}
                        </span>
                    )}
                  </Link>

                </>
              )}
              
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
               <Link to="/login" style={styles.loginBtn}>Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '15px 0',
    marginBottom: '30px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none'
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  welcome: {
    color: '#555',
    fontSize: '1rem'
  },
  link: {
    textDecoration: 'none',
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: '5px'
  },
  // Style baru agar teks dan badge bisa sejajar rapi
  linkContainer: {
    textDecoration: 'none',
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  // --- 4. STYLE UNTUK BADGE MERAH ---
  notificationBadge: {
    backgroundColor: '#e74c3c', // Merah
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    minWidth: '15px',
    textAlign: 'center',
    lineHeight: '1.2'
  },
  loginBtn: {
    textDecoration: 'none',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '5px',
    fontWeight: 'bold'
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Navbar;