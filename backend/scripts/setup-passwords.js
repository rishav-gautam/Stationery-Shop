/**
 * Script to set up default user passwords
 * Run this after importing sample_data.sql
 * 
 * Usage: node scripts/setup-passwords.js
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const password = 'admin123'; // Default password for all users

async function setupPasswords() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'stationery_shop',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to database');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Update all users with the hashed password
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE username IN ("admin", "manager", "staff1")',
      [hashedPassword]
    );

    console.log(`Updated ${result.affectedRows} user(s) with password: ${password}`);
    console.log('\nDefault login credentials:');
    console.log('Username: admin | Password: admin123 | Role: admin');
    console.log('Username: manager | Password: admin123 | Role: manager');
    console.log('Username: staff1 | Password: admin123 | Role: staff');

  } catch (error) {
    console.error('Error setting up passwords:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

setupPasswords();

