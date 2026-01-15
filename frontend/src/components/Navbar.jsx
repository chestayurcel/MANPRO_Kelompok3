import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/authService';
import { getAllBookings, getMyBookings } from '../services/bookingService';
import Swal from 'sweetalert2'; // Pastikan sudah npm install sweetalert2

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // --- 1. ADMIN: CEK JUMLAH PENDING (Untuk Badge Merah) ---
  useEffect(() => {
    if (user && user.role === 'admin') {
        const fetchAdminNotif = async () => {
            try {
                const data = await getAllBookings();
                const count = data.filter(item => item.status_pembayaran === 'pending').length;
                setPendingCount(count);
            } catch (error) {
                console.error("Silent error admin notif");
            }
        };
        fetchAdminNotif();
    }
  }, [user, location.pathname]); 

  // --- 2. PENGHUNI: POPUP NOTIFIKASI SAAT LOGIN / BUKA WEB ---
  useEffect(() => {
    // Hanya jalan jika user adalah PENGHUNI
    if (user && user.role === 'penghuni') {
        
        const checkMyBookingStatus = async () => {
            try {
                const myBookings = await getMyBookings();

                // Cari booking yang statusnya SUDAH FINAL (Lunas/Batal)
                // Tapi yang BELUM pernah kita kasih tau (cek di localStorage)
                const unreadBooking = myBookings.find(b => {
                    const isFinished = b.status_pembayaran === 'lunas' || b.status_pembayaran === 'batal';
                    const hasSeen = localStorage.getItem(`notif_seen_${b.id}`); // Cek tanda di browser
                    return isFinished && !hasSeen;
                });

                // Jika ketemu booking yang harus dinotifikasi
                if (unreadBooking) {
                    const isApproved = unreadBooking.status_pembayaran === 'lunas';
                    
                    Swal.fire({
                        title: isApproved ? 'Hore! Booking Disetujui 🎉' : 'Booking Ditolak 😔',
                        text: isApproved 
                            ? `Admin telah menyetujui booking kamar ${unreadBooking.Room?.nomor_kamar}. Silakan cek detailnya.` 
                            : 'Mohon maaf, pengajuan booking Anda belum dapat disetujui.',
                        icon: isApproved ? 'success' : 'error',
                        confirmButtonText: '📂 Cek Riwayat',
                        confirmButtonColor: '#3498db',
                        showCancelButton: true,
                        cancelButtonText: 'Tutup',
                        allowOutsideClick: false // User harus klik tombol
                    }).then((result) => {
                        // SETELAH POPUP DITUTUP/DIKLIK:
                        // Tandai di localStorage bahwa user SUDAH LIHAT notif untuk booking ID ini
                        // Jadi besok-besok gak muncul lagi
                        localStorage.setItem(`notif_seen_${unreadBooking.id}`, 'true');

                        if (result.isConfirmed) {
                            navigate('/history'); // Bawa ke halaman riwayat
                        }
                    });
                }

            } catch (error) {
                console.error("Gagal cek status booking user");
            }
        };

        checkMyBookingStatus();
    }
  }, [user]); // Effect ini jalan setiap kali User Login / Data User termuat


  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to={user ? "/" : "/"} style={styles.brand}>
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
                  <Link to="/admin/bookings" style={styles.linkContainer}>
                    📄 Booking/Pesanan
                    {pendingCount > 0 && (
                        <span style={styles.notificationBadge}>{pendingCount}</span>
                    )}
                  </Link>
                  <Link to="/admin/input-penghuni" style={styles.link}>➕ Input Manual</Link>
                  <Link to="/rooms" style={styles.link}>🏠 Kamar</Link>
                </>
              )}
              
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={styles.loginBtn}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '15px 0', marginBottom: '30px' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: '1.5rem', fontWeight: 'bold', color: '#333', textDecoration: 'none' },
  menu: { display: 'flex', alignItems: 'center', gap: '20px' },
  welcome: { color: '#555', fontSize: '1rem' },
  link: { textDecoration: 'none', color: '#3498db', fontWeight: 'bold', marginRight: '5px' },
  linkContainer: { textDecoration: 'none', color: '#3498db', fontWeight: 'bold', marginRight: '5px', display: 'flex', alignItems: 'center', gap: '5px' },
  notificationBadge: { backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem', fontWeight: 'bold', minWidth: '15px', textAlign: 'center', lineHeight: '1.2' },
  loginBtn: { textDecoration: 'none', backgroundColor: '#3498db', color: 'white', padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Navbar;