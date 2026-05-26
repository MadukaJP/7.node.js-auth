# Node.js Auth API

A Node.js authentication and authorization API built with Express, MongoDB, and JWT. Features user registration, login, role-based access control, and image upload to Cloudinary.

**Live URL:** [https://seven-node-js-auth.onrender.com](https://seven-node-js-auth.onrender.com)

## Features

- User registration with bcrypt password hashing
- Login with JWT token generation (15-minute expiry)
- Change password
- Role-based authorization (user / admin)
- Image upload to Cloudinary via Multer
- MongoDB database with Mongoose ODM

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Auth:** bcrypt, jsonwebtoken
- **File Upload:** Multer, Cloudinary
- **Deployment:** Render

## API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get JWT token |
| POST | `/api/auth/change-password` | Yes | Change user password |

### User Routes (`/api/users`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/` | No | Get all users |

### Home Routes (`/api/home`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/home/` | Yes | Home page (authenticated) |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/` | Yes + Admin | Admin dashboard |

### Image Routes (`/api/image`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/image/` | Yes | Get all images |
| POST | `/api/image/upload` | Yes + Admin | Upload an image |
| DELETE | `/api/image/:id` | Yes + Admin | Delete an image |

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

```bash
git clone <repo-url>
cd 7.node.js-auth
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Run

```bash
npm run dev    # development with nodemon
npm start      # production
```

## Project Structure

```
├── config/           # App configuration (port, DB URI, JWT secret)
├── controllers/      # Route handlers (auth, user, image)
├── database/         # MongoDB connection
├── middleware/        # Auth, admin, and upload middleware
├── models/           # Mongoose schemas (User, Image)
├── routes/           # Express route definitions
├── uploads/          # Temporary file upload directory
├── utils/            # Utility functions
├── server.js         # Entry point
└── .env              # Environment variables
```
