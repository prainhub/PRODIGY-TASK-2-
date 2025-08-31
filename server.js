const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');

const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a strong, random key in a real app

// In-memory "database" to store user and employee data.
// In a real-world application, you would use a database like MongoDB or PostgreSQL.
const users = [];
const employees = [];

// Middlewares
app.use(cors()); // Allow cross-origin requests from the HTML file
app.use(express.json()); // Enable JSON body parsing

// Middleware to verify the JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) return res.sendStatus(401); // No token provided

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user; // Attach the user payload to the request
        next();
    });
};

// Middleware for role-based access control
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied: Insufficient privileges.' });
        }
        next();
    };
};

// Seed a default admin user and some employee data for testing
const seedData = async () => {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    users.push({
        id: 1,
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
    });

    employees.push(
        { id: 1, name: 'John Doe', position: 'Software Engineer', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', position: 'Product Manager', email: 'jane.smith@example.com' }
    );
};

// Registration route (optional for this task, but good to have)
app.post('/register', async (req, res) => {
    try {
        const { username, password, role = 'member' } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword,
            role
        };
        users.push(newUser);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const payload = { id: user.id, username: user.username, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Protected route that requires a valid JWT
app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: `Welcome, ${req.user.username}! You have access to this protected data.`,
        user: req.user
    });
});

// --- Employee CRUD Endpoints (Admin Only) ---

// CREATE a new employee
app.post('/employees', authenticateToken, checkRole('admin'), (req, res) => {
    const { name, position, email } = req.body;
    if (!name || !position || !email) {
        return res.status(400).json({ message: 'Name, position, and email are required.' });
    }

    const newEmployee = {
        id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
        name,
        position,
        email
    };
    employees.push(newEmployee);
    res.status(201).json({ message: 'Employee added successfully!', employee: newEmployee });
});

// READ all employees
app.get('/employees', authenticateToken, checkRole('admin'), (req, res) => {
    res.json(employees);
});

// UPDATE an employee
app.put('/employees/:id', authenticateToken, checkRole('admin'), (req, res) => {
    const id = parseInt(req.params.id);
    const { name, position, email } = req.body;

    const employeeIndex = employees.findIndex(e => e.id === id);
    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found.' });
    }
    
    // Basic validation
    if (!name || !position || !email) {
        return res.status(400).json({ message: 'Name, position, and email are required.' });
    }

    employees[employeeIndex] = {
        id,
        name,
        position,
        email
    };
    res.json({ message: 'Employee updated successfully!', employee: employees[employeeIndex] });
});

// DELETE an employee
app.delete('/employees/:id', authenticateToken, checkRole('admin'), (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = employees.length;
    
    const newEmployees = employees.filter(e => e.id !== id);
    employees.length = 0; // Clear the array
    employees.push(...newEmployees); // Push filtered items

    if (employees.length === initialLength) {
        return res.status(404).json({ message: 'Employee not found.' });
    }

    res.json({ message: 'Employee deleted successfully!' });
});

// Start the server after seeding data
seedData().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to seed initial data:', err);
});
