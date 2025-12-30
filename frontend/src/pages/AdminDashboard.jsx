import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllRooms, deleteRoom } from '../services/roomService';

const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);

  // Load data saat halaman dibuka
  const fetchRooms = async () => {
    const data = await getAllRooms();
    setRooms(data);
  };

  useEffect(() => { fetchRooms(); }, []);

  // Handle Hapus
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kamar ini?')) {
        await deleteRoom(id);
        alert('Kamar dihapus!');
        fetchRooms(); // Refresh tabel
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
        <Link to="/rooms" style={btnStyle.back}>&larr; Kembali ke Home</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Dashboard Admin</h1>
        <Link to="/admin/rooms/new" style={btnStyle.add}>+ Tambah Kamar</Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr>
            <th style={p}>No Kamar</th>
            <th style={p}>Tipe</th>
            <th style={p}>Harga</th>
            <th style={p}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={p}>{room.nomor_kamar}</td>
              <td style={p}>{room.tipe}</td>
              <td style={p}>Rp {room.harga_per_bulan.toLocaleString()}</td>
              <td style={p}>
                <Link to={`/admin/rooms/edit/${room.id}`} style={btnStyle.edit}>Edit</Link>
                <button onClick={() => handleDelete(room.id)} style={btnStyle.delete}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styling CSS Object
const p = { padding: '10px', textAlign: 'left' };
const btnStyle = {
    add: { background: 'blue', color: 'white', padding: '10px 15px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
    edit: { background: '#f39c12', color: 'white', padding: '5px 10px', textDecoration: 'none', borderRadius: '5px', marginRight: '5px' },
    delete: { background: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminDashboard;