# TriageSync – Booking Management System

TriageSync is a web-based booking management application designed to simplify the process of managing bookings. It provides a platform for users to register, log in, create bookings, and manage their reservations.

## Features

- User Registration and Login
- User Authentication
- Booking Management
- Create New Bookings
- View Booking Details
- Cancel Bookings
- Admin Dashboard
- MongoDB Database Integration

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

## Project Structure



TriageSync/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── README.md
└── SOLUTION.md


## Installation and Setup

### 1. Clone the Repository


git clone YOUR_REPOSITORY_URL
cd TriageSync


### 2. Setup Backend


cd backend
npm install


Create a `.env` file in the backend directory:


PORT=5000
MONGODB_URI=your_mongodb_connection_string


### 3. Start Backend Server


npm run dev


### 4. Setup Frontend

Open another terminal:


cd frontend
npm install
npm run dev


## MongoDB Atlas Configuration

1. Create a MongoDB Atlas account.
2. Create a database cluster.
3. Create a database user.
4. Configure Network Access and allow your current IP address.
5. Copy the MongoDB connection string.
6. Add the connection string to the backend `.env` file.

## Environment Variables

Never upload your `.env` file or database credentials to GitHub.

Add the following to `.gitignore`:


node_modules/
.env
dist/


## Future Improvements

- Booking status tracking
- Email notifications
- Payment integration
- Booking history
- Improved admin controls
- Responsive UI enhancements

## License

This project is developed for educational and learning purposes.
