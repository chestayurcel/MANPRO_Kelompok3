import React, { useEffect, useState } from 'react';
import { getMyBookings, uploadBuktiBayar } from '../services/bookingService';
import Swal from 'sweetalert2';

const HistoryPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    // --- LOGIKA UPLOAD BUKTI ---
    const handleUpload = async (bookingId) => {
        const { value: file } = await Swal.fire({
            title: 'Upload Bukti Transfer',
            text: 'Format: JPG/PNG. Maks 2MB.',
            input: 'file',
            inputAttributes: { 'accept': 'image/*' },
            showCancelButton: true,
            confirmButtonText: 'Upload',
            showLoaderOnConfirm: true,
            preConfirm: async (file) => {
                if (!file) {
                    Swal.showValidationMessage('Silakan pilih file gambar dulu!');
                    return;
                }
                try {
                    await uploadBuktiBayar(bookingId, file);
                } catch (error) {
                    Swal.showValidationMessage(`Gagal upload: ${error.message}`);
                }
            }
        });

        if (file) {
            Swal.fire('Berhasil!', 'Bukti pembayaran berhasil dikirim. Tunggu konfirmasi admin ya!', 'success');
            loadData(); // Refresh data biar tombol upload berubah
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
            <h2>📜 Riwayat Booking Saya</h2>
            
            {bookings.length === 0 ? (
                <p>Belum ada riwayat booking.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                    {bookings.map(item => (
                        <div key={item.id} style={styles.card}>
                            <div style={{flex: 1}}>
                                <h3 style={{margin: '0 0 5px 0'}}>
                                    {item.Room ? `Kamar ${item.Room.nomor_kamar} (${item.Room.tipe})` : 'Kamar Dihapus'}
                                </h3>
                                <p style={{margin: '0', color: '#666'}}>Tanggal Masuk: {item.tanggal_masuk}</p>
                                <p style={{margin: '0', fontWeight: 'bold', color: '#27ae60'}}>
                                    Total: Rp {item.total_harga.toLocaleString()}
                                </p>
                            </div>

                            <div style={{textAlign: 'right'}}>
                                {/* BADGE STATUS */}
                                <div style={{
                                    marginBottom: '10px', fontWeight: 'bold',
                                    color: item.status_pembayaran === 'lunas' ? '#2ecc71' : 
                                           item.status_pembayaran === 'batal' ? '#e74c3c' : '#f39c12'
                                }}>
                                    Status: {item.status_pembayaran.toUpperCase()}
                                </div>

                                {/* LOGIKA TOMBOL UPLOAD: Hanya muncul jika status PENDING & Belum ada bukti */}
                                {item.status_pembayaran === 'pending' && (
                                    <>
                                        {item.bukti_bayar ? (
                                            <span style={{fontSize:'0.8rem', color:'#3498db'}}>
                                                ✅ Bukti Terkirim<br/>
                                                <small>(Menunggu Verifikasi Admin)</small>
                                            </span>
                                        ) : (
                                            <button 
                                                onClick={() => handleUpload(item.id)}
                                                style={styles.btnUpload}
                                            >
                                                📤 Upload Bukti Bayar
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    card: { border: '1px solid #ddd', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', backgroundColor: 'white' },
    btnUpload: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default HistoryPage;