// api/posts.js
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'YOUR_MYSQL_HOST', 
    user: 'YOUR_MYSQL_USER', // Ganti dengan user MySQL Anda
    password: 'YOUR_MYSQL_PASSWORD', // Ganti dengan password MySQL Anda
    database: 'my_database' // Ganti dengan nama database Anda
};

export default async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        if (req.method === 'GET') {
            const [rows] = await connection.execute('SELECT * FROM posts');
            res.status(200).json(rows);
        } else if (req.method === 'POST') {
            const { title, body } = req.body;
            const [result] = await connection.execute(
                'INSERT INTO posts (title, body) VALUES (?, ?)',
                [title, body]
            );
            res.status(201).json({ id: result.insertId, title, body });
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
