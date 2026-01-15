import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomDetail } from '../services/roomService';
import { createBooking } from '../services/bookingService';
import { getCurrentUser } from '../services/authService';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2'; // Pastikan import ini ada

const DetailRoomPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const user = getCurrentUser();

    // State untuk form booking
    const [tanggalMasuk, setTanggalMasuk] = useState('');
    const [durasi, setDurasi] = useState(1);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const data = await getRoomDetail(id);
                setRoom(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRoom();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!user) {
            Swal.fire('Login Dulu', 'Silakan login untuk memesan kamar.', 'warning');
            navigate('/login');
            return;
        }

        try {
            // 1. Kirim data booking ke backend
            await createBooking({
                roomId: room.id,
                tanggal_masuk: tanggalMasuk,
                durasi_bulan: durasi
            });

            // 2. TAMPILKAN POPUP INFORMASI PEMBAYARAN (Ini Bagian Pentingnya!)
            const totalBayar = room.harga_per_bulan * durasi;
            
            await Swal.fire({
                title: '✅ Booking Berhasil Dibuat!',
                html: `
                    <div style="text-align: left; font-size: 0.95rem;">
                        <p>Langkah selanjutnya, silakan transfer pembayaran:</p>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px dashed #333; margin: 10px 0;">
                            <p style="margin:0; font-weight:bold; color:#555;">Total Pembayaran:</p>
                            <h3 style="margin:5px 0; color:#27ae60;">Rp ${totalBayar.toLocaleString()}</h3>
                            <hr style="margin:10px 0; border-top:1px solid #ddd;">
                            <p style="margin:0; font-weight:bold; color:#555;">Transfer ke Bank BCA:</p>
                            <h2 style="margin:5px 0; color:#2c3e50;">123-456-7890</h2>
                            <p style="margin:0; font-size:0.9rem;">a.n. Permata Kost</p>
                        </div>
                        <p style="font-size: 0.9rem; color: #e74c3c;">
                            ⚠️ Harap simpan bukti transfer Anda!
                        </p>
                    </div>
                `,
                icon: 'info', // Ikon 'info' agar user aware ini instruksi
                confirmButtonText: '📂 Upload Bukti Bayar',
                confirmButtonColor: '#3498db',
                allowOutsideClick: false
            });

            // 3. Setelah user klik OK, arahkan ke Halaman Riwayat untuk upload
            navigate('/history');

        } catch (error) {
            Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
        }
    };

    if (!room) return <div>Loading...</div>;

    return (
        <>
            {/* Navbar otomatis ada dari App.jsx, jadi tidak perlu dipanggil di sini jika sudah global */}
            
            <div style={styles.container}>
                <img src={`http://localhost:5000/uploads/${room.foto}`} alt={room.nomor_kamar} style={styles.image} />
                
                <div style={styles.info}>
                    <h2>Kamar {room.nomor_kamar} - {room.tipe}</h2>
                    <p>{room.deskripsi}</p>
                    <h3 style={{color: '#27ae60'}}>Rp {room.harga_per_bulan.toLocaleString()} / bulan</h3>
                    
                    {/* FORM BOOKING */}
                    <div style={styles.bookingBox}>
                        <h4>Mulai Sewa</h4>
                        <form onSubmit={handleBooking}>
                            <div style={{marginBottom:'10px'}}>
                                <label>Tanggal Masuk:</label>
                                <input 
                                    type="date" 
                                    required 
                                    style={styles.input}
                                    onChange={(e) => setTanggalMasuk(e.target.value)}
                                />
                            </div>
                            <div style={{marginBottom:'10px'}}>
                                <label>Durasi (Bulan):</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    defaultValue="1" 
                                    required 
                                    style={styles.input}
                                    onChange={(e) => setDurasi(e.target.value)}
                                />
                            </div>
                            
                            {room.status === 'tersedia' ? (
                                <button type="submit" style={styles.btnBook}>Booking Sekarang</button>
                            ) : (
                                <button disabled style={styles.btnDisabled}>Tidak Tersedia</button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: { maxWidth: '900px', margin: '40px auto', padding: '20px', display: 'flex', gap: '30px' },
    image: { width: '400px', height: '300px', objectFit: 'cover', borderRadius: '10px' },
    info: { flex: 1 },
    bookingBox: { background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginTop: '20px', border: '1px solid #eee' },
    input: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' },
    btnBook: { width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    btnDisabled: { width: '100%', padding: '12px', background: '#ccc', color: '#666', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'not-allowed', marginTop: '10px' }
};

export default DetailRoomPage;