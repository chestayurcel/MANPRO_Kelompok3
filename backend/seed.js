// Perhatikan path ini: Mengarah ke folder src/models
const { db, User, Room, Booking } = require('./src/models'); 
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🔄 Memulai Reset Database...');

    // 1. Reset Database (Hapus tabel lama & buat baru)
    // force: true akan menghapus data lama, jadi hati-hati!
    await db.sync({ force: true });
    console.log('✅ Database berhasil disinkronisasi (Tabel dibuat ulang).');

    // 2. Buat Password Hash (Default: 123456)
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 3. Buat Data Users (Admin & Penghuni)
    await User.bulkCreate([
      {
        nama: 'Admin Permata',
        email: 'admin@permata.com',
        password: hashedPassword,
        role: 'admin',
        no_hp: '08123456789'
      },
      {
        nama: 'Budi Santoso', // Penghuni 1
        email: 'budi@gmail.com',
        password: hashedPassword,
        role: 'penghuni',
        no_hp: '08987654321'
      },
      {
        nama: 'Siti Aminah', // Penghuni 2
        email: 'siti@gmail.com',
        password: hashedPassword,
        role: 'penghuni',
        no_hp: '08555555555'
      }
    ]);
    console.log('✅ Data User berhasil dibuat.');

    // 4. Buat Data Kamar Dummy
    await Room.bulkCreate([
      {
        nomor_kamar: 'A-101',
        tipe: 'Regular (Non-AC)',
        harga_per_bulan: 800000,
        fasilitas: 'Kasur, Lemari, Kipas Angin, WiFi',
        foto_url: 'https://images.unsplash.com/photo-1522771753035-4848230d301c?w=500',
        status: 'tersedia'
      },
      {
        nomor_kamar: 'A-102',
        tipe: 'Exclusive (AC)',
        harga_per_bulan: 1500000,
        fasilitas: 'AC, Kasur Springbed, Kamar Mandi Dalam, WiFi, Meja Kerja',
        foto_url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500',
        status: 'tersedia' 
      },
      {
        nomor_kamar: 'B-201',
        tipe: 'Regular (Non-AC)',
        harga_per_bulan: 850000,
        fasilitas: 'Kasur, Meja Belajar, WiFi',
        foto_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500',
        status: 'tersedia'
      },
      {
        nomor_kamar: 'VIP-01',
        tipe: 'Apartment Style',
        harga_per_bulan: 2500000,
        fasilitas: 'Full Furnished, AC, TV, Kulkas, Kitchen Set',
        foto_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
        status: 'perbaikan' // Contoh status sedang perbaikan
      },
      {
        nomor_kamar: 'C-305',
        tipe: 'Exclusive (AC)',
        harga_per_bulan: 1600000,
        fasilitas: 'AC, Water Heater, Smart TV, WiFi',
        foto_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
        status: 'tersedia'
      }
    ]);
    console.log('✅ Data Room berhasil dibuat.');

    console.log('🎉 SEEDING SELESAI! Database siap digunakan.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal melakukan seeding:', error);
    process.exit(1);
  }
};

seedDatabase();