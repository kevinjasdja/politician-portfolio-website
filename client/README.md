# Somgarh Campaign Website - Client

Frontend application for the Somgarh Panchayat Campaign Website.

## Features

- **Home Page**: Hero section with 12+ campaign promises
- **Team Page**: Display team members with contact information
- **Beneficiary Card**: Create and verify digital beneficiary cards
- **Contact Page**: Contact form for public communication
- **Admin Dashboard**: Protected admin panel for content management

## Tech Stack

- React 19 with Vite
- Tailwind CSS 4
- React Router DOM
- Axios for API calls
- Framer Motion for animations
- html2canvas & jsPDF for card downloads
- Lucide React for icons

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

Development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PromiseCard.jsx
│   │   ├── TeamCard.jsx
│   │   ├── BeneficiaryCardDisplay.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Team.jsx
│   │   ├── Beneficiary.jsx
│   │   ├── Contact.jsx
│   │   ├── AdminLogin.jsx
│   │   └── Admin.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── .env
├── vite.config.js
└── package.json
```

## Pages

### Home (`/`)

- Hero section with campaign banner
- 12+ development promises in responsive grid
- Call-to-action buttons
- Floating contact button

### Team (`/team`)

- Grid display of all team members
- Member photos, names, positions, and contact numbers

### Beneficiary Card (`/beneficiary`)

- **Make Card Tab**: Create new beneficiary card with photo upload
- **Verify Card Tab**: Verify existing card by name and mobile
- Auto-generated unique 12-digit ID
- Download card as Image or PDF

### Contact (`/contact`)

- Contact form (Name, Email, Mobile, Message)
- Campaign description
- Form submission saves to database

### Admin Dashboard (`/admin`)

Protected route requiring authentication:

- **Hero Content**: Update homepage banner and text
- **Team Members**: Add, edit, delete team members
- **Contact Messages**: View and delete contact submissions
- **Beneficiary Cards**: View all cards and delete if needed

### Admin Login (`/admin/login`)

- Email and password authentication
- JWT token-based session
- Default credentials: admin@somgarh.com / admin123

## Admin Access

1. Navigate to `/admin/login`
2. Login with credentials
3. Access dashboard at `/admin`
4. Manage all content and view submissions

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
