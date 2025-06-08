# Frontend Guide - RestoApp

## Overview
Frontend aplikasi pemesanan makanan restoran yang dibangun dengan React.js, menggunakan Tailwind CSS untuk styling dan React Router untuk navigasi.

## Struktur Aplikasi

### Pages yang Telah Dibuat

#### 1. **UserDashboard** (`/dashboard`)
- **Fitur:**
  - Tampilan selamat datang dengan informasi user
  - Quick actions untuk navigasi ke fitur utama
  - Menampilkan menu populer dengan rating dan harga
  - Riwayat pesanan terakhir
  - Header dengan navigasi ke profile dan logout

- **Komponen Utama:**
  - Menu grid dengan informasi lengkap (nama, harga, rating, kategori)
  - Sidebar riwayat pesanan
  - Quick action cards untuk akses cepat

#### 2. **ProfilePage** (`/profile`)
- **Fitur:**
  - Edit username dan password
  - Validasi form (password minimal 6 karakter, konfirmasi password)
  - Hapus akun dengan konfirmasi
  - Integrasi dengan API user management

- **API Integration:**
  - `PATCH /api/user/{id}` - Update profile
  - `DELETE /api/user/{id}` - Delete account

#### 3. **OrderPage** (`/order`)
- **Fitur:**
  - Browse menu dengan filter kategori
  - Add/remove items ke/dari keranjang
  - Quantity management untuk setiap item
  - Catatan pesanan
  - Kalkulasi total harga otomatis
  - Submit order dengan konfirmasi

- **Komponen Utama:**
  - Menu grid dengan filter kategori
  - Shopping cart sidebar
  - Order summary dan checkout

### Routing Structure

```
/                    → Redirect ke /login
/login              → LoginPage
/register           → RegisterPage
/home               → HomePage (redirect logic)
/dashboard          → UserDashboard (Protected)
/profile            → ProfilePage (Protected)
/order              → OrderPage (Protected)
```

### Authentication Flow

1. **Login** → Redirect ke `/dashboard`
2. **Protected Routes** → Cek authentication, redirect ke `/login` jika tidak authenticated
3. **Logout** → Clear storage, redirect ke `/login`

## API Integration

### Authentication
- **Login:** `POST /api/login`
- **Logout:** `POST /api/logout`
- **Register:** `POST /api/register`
- **Refresh Token:** `GET /api/token`

### User Management
- **Update User:** `PATCH /api/user/{id}`
- **Delete User:** `DELETE /api/user/{id}`

### Menu Management
- **Get Menu Items:** `GET /api/menu`
- **Get Menu Item by ID:** `GET /api/menu/{id}`
- **Get Categories:** `GET /api/kategori`

### Order Management
- **Submit Order:** `POST /api/pesanan`
- **Get Order History:** `GET /api/pesanan/user/{userId}`
- **Get Order Details:** `GET /api/pesanan/{orderId}`
- **Update Order Status:** `PATCH /api/pesanan/{orderId}`

## State Management

### AuthContext
- `username` - Current user's username
- `userId` - Current user's ID
- `accessToken` - JWT token
- `login()` - Login function
- `logout()` - Logout function
- `isAuthenticated()` - Check authentication status

### Local Storage
- `accessToken` - JWT token
- `userName` - Username
- `userId` - User ID

## UI/UX Features

### Design System
- **Colors:** Blue primary (#2563eb), Gray neutrals
- **Typography:** Tailwind default font stack
- **Components:** Cards, buttons, forms dengan consistent styling
- **Icons:** Feather Icons (react-icons/fi)

### Responsive Design
- Mobile-first approach
- Grid layouts yang responsive
- Sticky headers dan sidebars
- Modal dialogs untuk konfirmasi

### User Experience
- Loading states untuk semua async operations
- Error handling dengan user-friendly messages
- Success notifications
- Form validation dengan real-time feedback

## Environment Setup

### Required Environment Variables
```env
VITE_API_URL=http://localhost:5000
```

Buat file `.env` di folder frontend dengan konfigurasi di atas. Sesuaikan port dengan backend server Anda.

### Dependencies
- React 19.1.0
- React Router DOM 7.6.2
- Tailwind CSS 4.1.8
- Axios 1.9.0
- React Icons 5.5.0
- js-cookie 3.0.5
- jwt-decode 4.0.0

## Development Guidelines

### File Structure
```
src/
├── api/
│   ├── AxiosInstance.js
│   ├── AxiosInterceptor.js
│   └── orderService.js
├── auth/
│   ├── AuthProvider.jsx
│   └── useAuth.js
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── HomePage.jsx
│   ├── UserDashboard.jsx
│   ├── ProfilePage.jsx
│   └── OrderPage.jsx
├── routes/
│   ├── RouterApp.jsx
│   └── ProtectedRoute.jsx
└── css/
```

### Code Standards
- Functional components dengan hooks
- PropTypes untuk type checking
- Consistent naming conventions
- Error boundaries untuk error handling
- Responsive design patterns

## Latest Updates

### ✅ **API Integration Implemented**
Semua halaman frontend kini telah terintegrasi dengan endpoint API backend dan sesuai dengan database schema:

1. **AuthProvider & LoginPage**: Menggunakan `/api/login` endpoint
2. **RegisterPage**: Sudah menggunakan `/api/register` endpoint  
3. **ProfilePage**: Terintegrasi dengan `/api/user/{id}` untuk update/delete
4. **UserDashboard**: Mengambil data menu dari `/api/menu` dengan relasi Kategori
5. **OrderPage**: Submit pesanan ke `/api/pesanan` dengan format yang sesuai database

### **Database Schema Compliance**
Frontend telah disesuaikan dengan struktur database:

**Menu Table Fields:**
- `id_menu`, `nama_menu`, `deskripsi`, `harga`, `gambar`, `kategoriId_kategori`

**Pesanan Table Fields:**
- `id_pesanan`, `status` ('Konfirmasi', 'Proses', 'Selesai'), `total_harga`, `createdAt`, `updatedAt`, `userId_user`, `menuId_menu`

**Pesan_Detail Table Fields:**
- `id_detail`, `jumlah`, `catatan`, `menuId_menu`, `pesananId_pesanan`

**Removed Fields:**
- ❌ Rating (tidak ada di database)
- ❌ PrepTime (tidak ada di database)  
- ❌ Available (tidak ada di database)
- ❌ Data dummy

### **Error Handling & Fallbacks**
- Semua API calls memiliki error handling yang proper
- Menu service memiliki fallback data jika API belum tersedia
- Loading states untuk semua async operations
- Graceful degradation jika backend belum siap

## Next Steps

### Backend Integration
1. ✅ Implement authentication endpoints (`/api/login`, `/api/register`)
2. ✅ Implement user management endpoints (`/api/user/{id}`)
3. 🔄 Implement menu API endpoints (`/api/makanan`)
4. 🔄 Implement order management API (`/api/pesanan`)
5. 🔄 Add real-time order status updates
6. 🔄 Implement payment integration

### Additional Features
1. Order history page
2. Real-time notifications
3. User preferences
4. Menu search functionality
5. Order tracking
6. Admin dashboard (untuk admin routes)

### Performance Optimizations
1. Image lazy loading
2. Code splitting
3. Caching strategies
4. Bundle optimization

## Testing
- Unit tests untuk components
- Integration tests untuk API calls
- E2E tests untuk user flows

## Deployment
- Build dengan `npm run build`
- Deploy ke Google Cloud Platform
- Environment variables configuration
- CI/CD pipeline setup 