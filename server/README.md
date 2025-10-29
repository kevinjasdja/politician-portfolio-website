# Somgarh Campaign Website - Server

Backend API for the Somgarh Panchayat Campaign Website.

## Features

- **Authentication**: JWT-based admin authentication
- **Hero Content Management**: Update homepage hero section
- **Team Management**: CRUD operations for team members
- **Contact Management**: Handle and view contact form submissions
- **Beneficiary Cards**: Create and verify beneficiary cards with unique IDs
- **File Uploads**: Image upload support using Multer

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing

## Environment Variables

Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/somgarh-campaign
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ADMIN_EMAIL=admin@somgarh.com
ADMIN_PASSWORD=admin123
```

## Installation

```bash
npm install
```

## Running the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### Admin Routes

- `POST /api/admin/login` - Admin login
- `POST /api/admin/init` - Initialize admin (first-time setup)
- `GET /api/admin/profile` - Get admin profile (protected)

### Hero Content

- `GET /api/hero` - Get hero content
- `PUT /api/hero` - Update hero content (protected)

### Team Members

- `GET /api/team` - Get all team members
- `POST /api/team` - Create team member (protected)
- `PUT /api/team/:id` - Update team member (protected)
- `DELETE /api/team/:id` - Delete team member (protected)

### Contact Messages

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (protected)
- `PUT /api/contact/:id/read` - Mark as read (protected)
- `DELETE /api/contact/:id` - Delete message (protected)

### Beneficiary Cards

- `POST /api/beneficiary` - Create beneficiary card
- `POST /api/beneficiary/verify` - Verify beneficiary card
- `GET /api/beneficiary` - Get all cards (protected)
- `DELETE /api/beneficiary/:id` - Delete card (protected)

## First-Time Setup

1. Start MongoDB
2. Run the server: `npm run dev`
3. Initialize admin: `POST http://localhost:5000/api/admin/init`
4. Login with default credentials: admin@somgarh.com / admin123

## Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── adminController.js    # Admin logic
│   ├── contactController.js  # Contact logic
│   ├── teamController.js     # Team logic
│   ├── beneficiaryController.js
│   └── heroController.js
├── middlewares/
│   ├── auth.js              # JWT authentication
│   └── upload.js            # Multer configuration
├── models/
│   ├── Admin.js
│   ├── Contact.js
│   ├── TeamMember.js
│   ├── BeneficiaryCard.js
│   └── HeroContent.js
├── routes/
│   ├── adminRoutes.js
│   ├── contactRoutes.js
│   ├── teamRoutes.js
│   ├── beneficiaryRoutes.js
│   └── heroRoutes.js
├── uploads/                 # Uploaded files
├── .env
├── server.js
└── package.json
```
