// backend
import mysql from 'mysql2/promise'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT userId FROM users WHERE email = ?',
      [email]
    );

    if (rows.length > 0) {
      res.status(200).json({ userId: rows[0].userId });
    } else {
      res.status(404).json({ error: 'Email not registered' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) await connection.end();
  }
}