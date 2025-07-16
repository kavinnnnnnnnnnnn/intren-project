// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const { createOrder } = require('./order'); // Keep your order handling

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

/**
 * ✅ CHECKOUT ROUTE
 */
app.post('/checkout', (req, res) => {
  const {
    full_name,
    email,
    phone,
    address,
    payment_method,
    items,
    total
  } = req.body;

  if (!full_name || !email || !phone || !address || !payment_method || !items || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  createOrder({ full_name, email, phone, address, payment_method, items, total }, (err, orderId) => {
    if (err) {
      console.error('❌ Order failed:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log('✅ Order placed, ID:', orderId);
    res.json({ success: true, orderId });
  });
});

/**
 * ✅ SIGNUP ROUTE
 */
app.post('/signup', async (req, res) => {
  const { signupEmail, signupPassword, signupName } = req.body;
  if (!signupEmail || !signupPassword || !signupName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(signupPassword, 10);
    const query = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
    db.query(query, [signupEmail, hashedPassword, signupName], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Email already registered' });
        }
        console.error('❌ Signup error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('✅ User registered, ID:', result.insertId);
      res.json({ success: true, userId: result.insertId });
    });
  } catch (err) {
    console.error('❌ Hashing error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * ✅ LOGIN ROUTE
 */
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('❌ Login error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email not found' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  });
});

/**
 * ✅ Start Server
 */
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
