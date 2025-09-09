# 🧑‍💻 BigForum

Aplikasi **BigForum** berbasis **Next.js (Frontend)** dan **Express.js + PostgreSQL (Backend)**. 

Mendukung fitur:

- Login (JWT + Cookie)
- CRUD User
- Filtering, Search, dan Pagination
- Modal untuk Add/Edit/Delete
- Soft Delete (Ubah status aktif/nonaktif, tanpa menghapus data)

## 🚀 Cara Menjalankan

### 1. Clone Repo
```bash
git clone https://github.com/indrarz/bigforum-test.git
```

### 2. Setup Backend
```bash
cd backend
npm install
```

#### 2.1 Buat file .env
```bash
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=databasepassword
DB_NAME=databasename
JWT_SECRET=supersecretkey
```

#### 2.2 Buat Database
```
CREATE DATABASE user;
```

#### 2.3 Jalankan Seeder
```
node .\seeder.js
```

#### 2.4 Jalankan Server
```
npm run start
```

### 3. Setup Frontend
```bash
cd ../
npm install
```

#### 3.1 Buat file .env
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

#### 3.2 Jalankan Frontend
```
npm run dev
```

## 🏗️ Arsitektur & Keputusan Teknis

### 1. Frontend (Next.js + React + Tailwind)

#### 📦 package.json
```bash
{
  "dependencies": {
    "axios": "^1.11.0",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.542.0",
    "next": "15.5.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "universal-cookie": "^8.0.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 2.Backend (Express.js + Sequelize + PostgreSQL)

#### 📦 package.json
```bash
{
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "compression": "^1.8.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "jwt-decode": "^4.0.0",
    "morgan": "^1.10.1",
    "pg": "^8.16.3",
    "sequelize": "^6.37.7"
  }
}
```

### 3. Flow Arsitektur

```bash
[ React + Next.js (Frontend) ]
          |
          v
[ Axios HTTP Request ]
          |
          v
[ Express.js REST API (Backend) ]
          |
          v
[ Sequelize ORM ]
          |
          v
[ PostgreSQL Database ]

```

## ⏱️ Waktu yang Dihabiskan & Trade-offs

### Waktu Pengerjaan
- Backend: ± 4 jam
- Frontend: ± 8 jam

### Trade-offs

- Login hanya pakai access token (lebih cepat dibuat), tapi untuk produksi sebaiknya ditambah refresh token agar lebih aman.
- Sequelize membuat coding lebih singkat, tapi query rumit lebih lambat dibanding raw SQL.
- Soft Delete (nonaktifkan user, bukan hapus data) → data tetap ada, tapi query harus selalu cek status.