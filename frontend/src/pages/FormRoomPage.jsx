import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createRoom, getRoomDetail, updateRoom } from '../services/roomService';

const FormRoomPage = () => {
  const { id } = useParams(); // Ambil ID kalau mode Edit
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // State Form
  const [formData, setFormData] = useState({
    nomor_kamar: '',
    tipe: 'Regular (Non-AC)',
    harga_per_bulan: '',
    fasilitas: '',
    foto_url: '',
    status: 'tersedia'
  });

  // Kalau mode Edit, isi form dengan data lama
  useEffect(() => {
    if (isEdit) {
      getRoomDetail(id).then(data => {
        setFormData({
            nomor_kamar: data.nomor_kamar,
            tipe: data.tipe,
            harga_per_bulan: data.harga_per_bulan,
            fasilitas: data.fasilitas,
            foto_url: data.foto_url,
            status: data.status
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isEdit) {
            await updateRoom(id, formData);
            alert('Kamar berhasil diupdate!');
        } else {
            await createRoom(formData);
            alert('Kamar berhasil dibuat!');
        }
        navigate('/admin/dashboard');
    } catch (error) {
        alert('Gagal menyimpan data');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>{isEdit ? 'Edit Kamar' : 'Tambah Kamar Baru'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input type="text" name="nomor_kamar" placeholder="Nomor Kamar (Contoh: A-101)" value={formData.nomor_kamar} onChange={handleChange} required style={inputStyle} />
        
        <select name="tipe" value={formData.tipe} onChange={handleChange} style={inputStyle}>
            <option value="Regular (Non-AC)">Regular (Non-AC)</option>
            <option value="Exclusive (AC)">Exclusive (AC)</option>
        </select>

        <input type="number" name="harga_per_bulan" placeholder="Harga per Bulan" value={formData.harga_per_bulan} onChange={handleChange} required style={inputStyle} />
        
        <textarea name="fasilitas" placeholder="Fasilitas (Pisahkan dengan koma)" value={formData.fasilitas} onChange={handleChange} rows="3" style={inputStyle}></textarea>
        
        <input type="text" name="foto_url" placeholder="URL Foto (Link Gambar)" value={formData.foto_url} onChange={handleChange} style={inputStyle} />

        <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
            <option value="tersedia">Tersedia</option>
            <option value="terisi">Terisi</option>
            <option value="perbaikan">Perbaikan</option>
        </select>

        <button type="submit" style={{ padding: '10px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Simpan</button>
        <Link to="/admin/dashboard" style={{ textAlign: 'center', textDecoration: 'none', color: '#555' }}>Batal</Link>
      </form>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' };

export default FormRoomPage;