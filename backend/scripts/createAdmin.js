const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-issues');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@civic.gov' });
    if (existingAdmin) {
      console.log('Default admin already exists');
      process.exit(0);
    }

    // Create default admin
    const admin = new Admin({
      name: 'System Administrator',
      email: 'admin@civic.gov',
      password: 'admin123',
      role: 'super_admin',
      department: 'Municipal Corporation'
    });

    await admin.save();
    console.log('Default admin created successfully');
    console.log('Email: admin@civic.gov');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

createDefaultAdmin();
