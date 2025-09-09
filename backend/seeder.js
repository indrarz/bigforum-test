require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db } = require('./config/db');
const User = require('./model/User');

// Fungsi untuk meng-hash password
async function hashPassword(data) {
  return await bcrypt.hash(data, 10);
}

(async () => {
  try {
    const hashedPassword = await hashPassword('password123');

    const defaultUsers = [
      { email: 'example@gmail.com', first_name: 'John', last_name: 'Doe', password: hashedPassword },
    ];

    async function autoFeeder() {
      try {
        // Koneksi ke database
        await db.authenticate();
        console.log('Database connected.');

        // Sinkronisasi model dengan database
        await db.sync({ alter: true });
        console.log('Database synchronized.');

        // Menambahkan data default ke tabel User
        for (const user of defaultUsers) {
          // Periksa apakah user sudah ada
          const [existingUser] = await User.findOrCreate({
            where: { email: user.email },
            defaults: user
          });

          if (existingUser) {
            console.log(`User ${user.email} already exists or created.`);
          } else {
            console.log(`User ${user.email} created.`);
          }
        }
      } catch (err) {
        console.error('Error in autoFeeder:', err.message);
      }
    }

    // Jalankan auto feeder
    await autoFeeder();
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
