# Mini Social Post Application

A full-stack MERN (MongoDB, Express, React, Node.js) social media application built as part of the 3W Full Stack Internship Assignment. This app is inspired by the social page of the TaskPlanet app.

## 🚀 Features

- **User Authentication**: Secure Signup and Login using JWT.
- **Social Feed**: A public feed where users can see posts from everyone.
- **Post Creation**: Create posts with text, images, or both.
- **Interactions**: Like and comment on posts with real-time UI updates.
- **Responsive UI**: Built with Material UI (MUI) for a clean, modern, and mobile-responsive experience.
- **Infinite Loading**: "Load More" functionality for browsing posts.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Material UI, Axios, React Router, React Toastify.
- **Backend**: Node.js, Express.js, JWT, Multer (for image uploads), Bcryptjs.
- **Database**: MongoDB (Atlas/Local).

## 📁 Project Structure

```text
3W/
├── backend/            # Express server, MongoDB models, and API routes
│   ├── models/         # User and Post schemas
│   ├── routes/         # Auth and Post API endpoints
│   ├── uploads/        # Stored images
│   └── server.js       # Entry point
├── frontend/           # Vite + React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth state management
│   │   ├── pages/      # Login, Signup, and Feed pages
│   │   └── App.jsx     # Main routing and theme setup
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Alok-cgp/3W-1st-assignment.git
cd 3W-1st-assignment
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend:
```bash
npm run dev
```

## 🌐 Deployment

- **Backend**: Hosted on [Render](https://render.com/)
- **Frontend**: Hosted on [Vercel](https://vercel.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 👤 Author
- **Alok** - [GitHub Profile](https://github.com/Alok-cgp)

---
*Built for the 3W Full Stack Internship Assignment (Task 1).*
