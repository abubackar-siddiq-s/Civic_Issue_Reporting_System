# Civic Issue Reporting System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image uploads)

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/civic-issues
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
```

### 3. Create Default Admin User

```bash
npm run create-admin
```

This creates a default admin user:
- Email: `admin@civic.gov`
- Password: `admin123`

### 4. Start the Application

#### Development Mode (Recommended)
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

#### Production Mode
```bash
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:3000/admin/login

## 📋 Features Overview

### Citizen Features
- ✅ Report civic issues with photos
- ✅ Location tracking (auto/manual)
- ✅ Issue categorization
- ✅ Priority selection
- ✅ View all reported issues
- ✅ Track issue status
- ✅ Search and filter issues

### Admin Features
- ✅ Secure admin authentication
- ✅ Dashboard with statistics
- ✅ View all issues with filters
- ✅ Update issue status
- ✅ Assign issues to departments
- ✅ Category and priority management
- ✅ Issue resolution tracking

### Technical Features
- ✅ MERN stack architecture
- ✅ MongoDB database
- ✅ Cloudinary image storage
- ✅ JWT authentication
- ✅ Responsive design
- ✅ RESTful API
- ✅ Form validation
- ✅ Error handling

## 🗂️ Project Structure

```
civic-issue-reporting-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js
│   └── package.json
├── models/                # MongoDB models
│   ├── Issue.js
│   └── Admin.js
├── routes/                # Express routes
│   ├── auth.js
│   ├── issues.js
│   └── admin.js
├── middleware/            # Custom middleware
│   ├── auth.js
│   └── upload.js
├── scripts/               # Utility scripts
│   └── createAdmin.js
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env` file
3. Database will be created automatically

### Cloudinary Setup
1. Create account at https://cloudinary.com
2. Get your cloud name, API key, and API secret
3. Update `.env` file with your credentials

### Admin User Management
- Default admin is created with `npm run create-admin`
- Additional admins can be registered via `/api/auth/register`
- Admin credentials are stored securely with bcrypt hashing

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network access if using cloud MongoDB

2. **Cloudinary Upload Fails**
   - Verify API credentials in `.env`
   - Check Cloudinary account status
   - Ensure image file size is under 5MB

3. **Admin Login Issues**
   - Run `npm run create-admin` to create default admin
   - Check if admin exists in database
   - Verify JWT_SECRET is set

4. **Frontend Not Loading**
   - Ensure both backend and frontend are running
   - Check proxy configuration in client/package.json
   - Verify port 3000 and 5000 are available

### Development Tips

1. **Database Reset**
   ```bash
   # Drop and recreate database
   mongo civic-issues --eval "db.dropDatabase()"
   npm run create-admin
   ```

2. **Clear Browser Cache**
   - Hard refresh (Ctrl+F5) when making frontend changes
   - Clear localStorage for admin token issues

3. **API Testing**
   - Use Postman or similar tool to test API endpoints
   - Check browser network tab for API errors

## 📱 Mobile Responsiveness

The application is designed to be responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Heroku Deployment
1. Create Heroku app
2. Add MongoDB Atlas addon
3. Set environment variables
4. Deploy with `git push heroku main`

### Vercel/Netlify (Frontend Only)
1. Build frontend: `npm run build`
2. Deploy client/build folder
3. Update API URLs in production

## 📊 Database Schema

### Issues Collection
```javascript
{
  title: String,
  description: String,
  category: String, // Garbage, Streetlight, Water, Road, Drainage, Other
  priority: String, // Low, Medium, High, Critical
  status: String,   // Submitted, In Progress, Resolved, Closed
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  images: [{ url: String, public_id: String }],
  reporterInfo: {
    name: String,
    email: String,
    phone: String
  },
  assignedTo: String,
  adminNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Admins Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String, // admin, super_admin
  department: String,
  createdAt: Date
}
```

## 🎯 API Endpoints

### Public Endpoints
- `POST /api/issues` - Create new issue
- `GET /api/issues` - Get all issues
- `GET /api/issues/:id` - Get single issue
- `GET /api/issues/search/:query` - Search issues

### Admin Endpoints
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `GET /api/admin/issues` - Get all issues (admin view)
- `PUT /api/admin/issues/:id` - Update issue
- `DELETE /api/admin/issues/:id` - Delete issue
- `GET /api/admin/dashboard` - Dashboard statistics

## 📞 Support

For issues or questions:
1. Check this README first
2. Review the troubleshooting section
3. Check the console for error messages
4. Verify all environment variables are set correctly

---

**Built for Government of Jharkhand - Clean & Green Technology Theme**
**Problem ID: 25031 - Crowdsourced Civic Issue Reporting and Resolution System**
