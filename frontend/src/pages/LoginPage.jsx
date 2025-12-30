import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Untuk pindah halaman

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setError('');

    try {
      await loginUser(email, password);
      alert('Login Berhasil! 🎉');
      navigate('/rooms'); // Pindahkan user ke halaman Home
    } catch (err) {
      setError(err.message || 'Login Gagal, cek email/password!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login Permata Kost</h2>
        
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Masukkan email..."
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Masukkan password..."
              required 
            />
          </div>

          <button type="submit" style={styles.button}>Masuk</button>
        </form>
        
        <p style={{marginTop: '15px', fontSize: '0.9rem', textAlign: 'center'}}>
            Belum punya akun? <Link to="/register" style={{color: 'blue', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold'}}>
            Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

// CSS-in-JS Sederhana
const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  card: { width: '100%', maxWidth: '400px', padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  errorAlert: { backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center' }
};

export default LoginPage;