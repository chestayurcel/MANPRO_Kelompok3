import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../services/roomService';
import { createOfflineBooking } from '../services/bookingService';
import { useNavigate } from 'react-router-dom';

const AdminPenghuniPage = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    
    // State Data Text
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        no_hp: '',
        roomId: '',
        tanggal_masuk: '',
        durasi_bulan: 1
    });

    // State Khusus File
    const [fileBukti, setFileBukti] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            const data = await getAllRooms();
            setRooms(data.filter(r => r.status === 'tersedia'));
        };
        fetchRooms();
    }, []);

    // Handle Input Teks
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Input File
    const handleFileChange = (e) => {
        setFileBukti(e.target.files[0]); // Ambil file pertama
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ⚠️ PENTING: Gunakan FormData untuk kirim File + Teks
        const dataToSend = new FormData();
        dataToSend.append('nama', formData.nama);
        dataToSend.append('email', formData.email);
        dataToSend.append('no_hp', formData.no_hp);
        dataToSend.append('roomId', formData.roomId);
        dataToSend.append('tanggal_masuk', formData.tanggal_masuk);
        dataToSend.append('durasi_bulan', formData.durasi_bulan);

        // Jika ada file, masukkan ke FormData dengan nama 'bukti'
        // (Harus sama dengan upload.single('bukti') di backend)
        if (fileBukti) {
            dataToSend.append('bukti', fileBukti);
        }

        try {
            await createOfflineBooking(dataToSend);
            alert('✅ Data berhasil disimpan & Bukti terupload!');
            navigate('/admin/bookings');
        } catch (error) {
            console.error(error);
            alert('Gagal: ' + (error.response?.data?.message || "Terjadi kesalahan"));
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{textAlign:'center', marginBottom: '20px'}}>📝 Input Penghuni Offline</h2>
            <div style={styles.card}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    {/* BAGIAN 1: DATA DIRI */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Data Diri Penghuni</h4>
                        <input type="text" name="nama" placeholder="Nama Lengkap" required style={styles.input} onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email (Harus Unik)" required style={styles.input} onChange={handleChange} />
                        <input type="text" name="no_hp" placeholder="Nomor HP / WA" required style={styles.input} onChange={handleChange} />
                    </div>

                    <hr style={{margin: '15px 0', border:'none', borderTop:'1px solid #eee'}} />

                    {/* BAGIAN 2: PILIH KAMAR */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Pilih Kamar & Durasi</h4>
                        <select name="roomId" required style={styles.select} onChange={handleChange}>
                            <option value="">-- Pilih Kamar Tersedia --</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id}>
                                    {room.nomor_kamar} - {room.tipe} (Rp {room.harga_per_bulan.toLocaleString()})
                                </option>
                            ))}
                        </select>

                        <div style={{display:'flex', gap:'10px'}}>
                            <div style={{flex:1}}>
                                <label style={styles.label}>Tanggal Masuk</label>
                                <input type="date" name="tanggal_masuk" required style={styles.input} onChange={handleChange} />
                            </div>
                            <div style={{flex:1}}>
                                <label style={styles.label}>Durasi (Bulan)</label>
                                <input type="number" name="durasi_bulan" min="1" defaultValue="1" required style={styles.input} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <hr style={{margin: '15px 0', border:'none', borderTop:'1px solid #eee'}} />

                    {/* BAGIAN 3: UPLOAD BUKTI (BARU) */}
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Bukti Pembayaran / Kwitansi</h4>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            style={styles.fileInput} 
                        />
                        <small style={{color:'#666'}}>*Upload foto bukti transfer atau kwitansi fisik</small>
                    </div>

                    <button type="submit" style={styles.btn}>Simpan & Upload</button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '600px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' },
    card: { background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    sectionTitle: { marginBottom:'10px', color:'#555', borderLeft: '4px solid #3498db', paddingLeft:'10px' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
    select: { padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: 'white', width: '100%' },
    fileInput: { padding: '10px', border: '1px dashed #ccc', borderRadius: '5px', width: '100%', boxSizing: 'border-box' },
    label: { fontSize: '0.8rem', color: '#666', marginBottom: '5px', display: 'block' },
    btn: { padding: '15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default AdminPenghuniPage;