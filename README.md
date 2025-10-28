# Civic Issue Reporting System

A MERN stack application for crowdsourced civic issue reporting and resolution.

## Features

### Citizen Module
- Report civic issues with photo upload
- Location tracking (auto or manual)
- Issue description
- View submitted issues
- Status tracking

### Admin Module
- Admin authentication
- Dashboard to view all issues
- Filter by category, location, priority
- Update issue status
- Assign issue types

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express.js
- Database: MongoDB
- Image Storage: Cloudinary
- Authentication: JWT

## Setup Instructions

1. Install dependencies:
```bash
npm install
cd client && npm install
```

2. Create a `.env` file in the root directory with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Default Admin Credentials
- Email: admin@civic.gov
- Password: admin123
