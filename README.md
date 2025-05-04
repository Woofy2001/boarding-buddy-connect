# 🏡 Boarding Buddy – Backend

A robust, secure, and modular REST API built with **Node.js**, **Express**, and **MongoDB**, powering the backend of a full-stack boarding space rental platform.

---

## 🔐 Authentication & Authorization
- JWT-based login & registration for `student` and `landlord` roles
- Role-based access control enforced on all protected routes
- Secure password hashing using `bcryptjs`
- Middleware for route protection and user verification

---

## 👤 User Management
- `GET /api/users/me` — fetch current user profile
- Stores university, user type, language preference
- Token returns on login/register for frontend session handling

---

## 🏠 Property Listings
- Full CRUD operations for listings
  - `POST /api/listings` — landlords can create
  - `GET /api/listings` — public, with filters
  - `PUT /api/listings/:id` — landlords can update
  - `DELETE /api/listings/:id` — only by listing owner
- Filter support by:
  - Location
  - Max price
  - Amenities (WiFi, Laundry, AC, etc.)

---

## 🖼️ Image Uploads
- Integrated with **Cloudinary**
- Uploads handled using `multer` + `streamifier`
- Stores multiple listing images

---

## ⭐ Bookmark System
- Students can save favorite listings
- Routes:
  - `POST /api/bookmarks/:id`
  - `DELETE /api/bookmarks/:id`
  - `GET /api/bookmarks`

---

## 💬 Messaging System
- Secure 1:1 messaging between students and landlords
- `POST /api/messages` — send message
- `GET /api/messages` — inbox of all conversations
- `GET /api/messages/:userId` — conversation with specific user
- Messages linked to listings and users (populated)
- Ready for real-time Socket.io upgrade

---

## 🧰 Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- Cloudinary + Multer
- JWT, bcryptjs
- Postman-tested APIs

---

✅ **Status**: Core backend fully functional and tested  
🔜 **Next Step**: Build frontend screens with React Native + Expo
