// order.js
const db = require('./db');

function createOrder(orderData, callback) {
  const {
    full_name,
    email,
    phone,
    address,
    payment_method,
    items,
    total
  } = orderData;

  const sql = `
    INSERT INTO orders 
    (full_name, email, phone, address, payment_method, items, total)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [full_name, email, phone, address, payment_method, JSON.stringify(items), total],
    (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result.insertId);
    }
  );
}

function createUser(userData, callback) {
  const { email, password, name } = userData;
  const sql = `
    INSERT INTO users (email, password, name)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [email, password, name], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result.insertId);
  });
}

function checkUser(email, password, callback) {
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return callback(err);
    }
    if (results.length > 0) {
      callback(null, results[0]);
    } else {
      callback(null, null);
    }
  });
}

module.exports = { createOrder, createUser, checkUser };
