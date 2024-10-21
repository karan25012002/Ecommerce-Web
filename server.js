import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '@*#Karan25', // replace with your MySQL password
    database: 'user_auth' // name of your database
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Signup route
app.post('/signup', async (req, res) => {
    const { username, email, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, email, password, address) VALUES (?, ?, ?, ?)";

    db.query(query, [username, email, hashedPassword, address], (err, results) => {
        if (err) {
            return res.json({ message: "Error: " + err.message });
        }
        res.json({ message: "Signup successful!" });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ?";
    
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.json({ message: "Error: " + err.message });
        }
        if (results.length > 0) {
            const isValidPassword = await bcrypt.compare(password, results[0].password);
            if (isValidPassword) {
                res.json({ message: "Login successful!" });
            } else {
                res.json({ message: "Invalid email or password!" });
            }
        } else {
            res.json({ message: "Invalid email or password!" });
        }
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
