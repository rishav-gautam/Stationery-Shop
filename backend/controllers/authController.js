const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const register = async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, role || 'staff']
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
    // DEBUG POINT 1: Function entry
    console.log('--- LOGIN ATTEMPT START ---');
    try {
      const { username, password } = req.body;
      // DEBUG POINT 2: Request body received
      console.log(`[DEBUG] Received request body for username: ${username}`);
      // NOTE: NEVER log the 'password' in a real application, even for debugging, due to security risks.
  
      // Find user
      // DEBUG POINT 3: Before database query
      console.log('[DEBUG] Executing database query to find user...');
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, username]
      );
      // DEBUG POINT 4: After database query
      console.log(`[DEBUG] Database query executed. Users found: ${users.length}`);
  
      if (users.length === 0) {
        // DEBUG POINT 5: User not found
        console.log(`[DEBUG] User not found for username/email: ${username}. Sending 401.`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const user = users[0];
      // DEBUG POINT 6: User object retrieved
      console.log(`[DEBUG] User found. ID: ${user.id}, Role: ${user.role}, Is Active: ${user.is_active}`);
  
      if (!user.is_active) {
        // DEBUG POINT 7: Account inactive check failed
        console.log(`[DEBUG] Account for user ID ${user.id} is inactive. Sending 401.`);
        return res.status(401).json({ message: 'Account is inactive' });
      }
  
      // Check password
      // DEBUG POINT 8: Before password comparison
      console.log('[DEBUG] Beginning password comparison...');
      const isMatch = await bcrypt.compare(password, user.password);
      // DEBUG POINT 9: After password comparison
      console.log(`[DEBUG] Password comparison result: ${isMatch}`);
  
      if (!isMatch) {
        // DEBUG POINT 10: Password check failed
        console.log(`[DEBUG] Password mismatch for user ID ${user.id}. Sending 401.`);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate token
      // DEBUG POINT 11: Before token generation
      console.log('[DEBUG] Password matched. Generating JWT token...');
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
      // DEBUG POINT 12: After token generation
      console.log('[DEBUG] Token generated successfully.');
      // NOTE: NEVER log the 'token' itself in a real application.
  
      // DEBUG POINT 13: Before successful response
      console.log(`[DEBUG] Login successful for user ID ${user.id}. Sending 200 response.`);
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
  
      // DEBUG POINT 14: Function exit (Success)
      console.log('--- LOGIN ATTEMPT END (SUCCESS) ---');
    } catch (error) {
      // DEBUG POINT 15: Error caught
      console.error('Login error:', error);
      res.status(500).json({ message: error.message || 'Internal server error' }); // Use error.message for cleaner response
  
      // DEBUG POINT 16: Function exit (Error)
      console.log('--- LOGIN ATTEMPT END (ERROR) ---');
    }
  };

const getProfile = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getProfile };

