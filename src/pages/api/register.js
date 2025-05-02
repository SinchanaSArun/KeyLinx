//backend

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: 'User ID and Email are required' });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await db.execute('SELECT * FROM users WHERE userId = ?', [userId]);

    if (rows.length > 0) {
      return res.status(400).json({ error: 'User ID already exists' });
    }

    await db.execute('INSERT INTO users (userId, email) VALUES (?, ?)', [userId, email]);
    await db.end();

    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database connection error' });
  }
}
