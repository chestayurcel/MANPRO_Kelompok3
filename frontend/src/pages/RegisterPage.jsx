import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  // State untuk menampung input user
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    no_hp: ''
  });

  const [error, setError] = useState('');

  // Handle perubahan input
  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await registerUser(formData);
      Swal.fire({
        title: 'Registrasi Berhasil! 🎉',
        text: 'Akun Anda telah dibuat. Silakan login.',
        icon: 'success',
        confirmButtonText: 'Ke Login',
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        navigate('/login'); // Lempar ke halaman login setelah sukses
      });
    } catch (err) {
      setError(err.message || 'Gagal mendaftar.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Daftar Akun Baru</h2>
        
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label>Nama Lengkap</label>
            <input 
              type="text" name="nama"
              value={formData.nama} onChange={handleChange}
              style={styles.input} required 
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Nomor HP (WhatsApp)</label>
            <input 
              type="text" name="no_hp"
              value={formData.no_hp} onChange={handleChange}
              style={styles.input} required 
              placeholder="Contoh: 08123456789"
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" name="email"
              value={formData.email} onChange={handleChange}
              style={styles.input} required 
              placeholder="email@contoh.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" name="password"
              value={formData.password} onChange={handleChange}
              style={styles.input} required 
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button type="submit" style={styles.button}>Daftar Sekarang</button>
        </form>
        
        <p style={{marginTop: '15px', fontSize: '0.9rem', textAlign: 'center'}}>
           Sudah punya akun? <Link to="/login" style={{color: 'blue', textDecoration:'none', fontWeight:'bold'}}>Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5', padding: '20px' },
  card: { width: '100%', maxWidth: '400px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  errorAlert: { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }
};

export default RegisterPage;