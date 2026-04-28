const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve public folder
app.use(express.static('public'));

// Database
const db = new sqlite3.Database('./pets.db');

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            type TEXT,
            description TEXT,
            image TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT,
            image TEXT
        )
    `);
});


// ---------- PET ROUTES ----------

// Read pets
app.get('/api/pets', (req, res) => {
    db.all("SELECT * FROM pets", [], (err, rows) => {
        res.json(rows);
    });
});

// Add pet
app.post('/api/pets', (req, res) => {
    const { name, type, description, image } = req.body;

    db.run(
        `INSERT INTO pets(name,type,description,image) VALUES(?,?,?,?)`,
        [name, type, description, image],
        function(err) {
            res.json({ id: this.lastID });
        }
    );
});

// Update pet
app.put('/api/pets/:id', (req, res) => {
    const { name, type, description, image } = req.body;

    db.run(
        `UPDATE pets SET name=?, type=?, description=?, image=? WHERE id=?`,
        [name, type, description, image, req.params.id],
        () => res.json({ updated: true })
    );
});

// Delete pet
app.delete('/api/pets/:id', (req, res) => {
    db.run(
        `DELETE FROM pets WHERE id=?`,
        [req.params.id],
        () => res.json({ deleted: true })
    );
});


// ---------- BOOK ROUTES ----------

// Read books
app.get('/api/books', (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        res.json(rows);
    });
});

// Add book
app.post('/api/books', (req, res) => {
    const { title, author, image } = req.body;

    db.run(
        `INSERT INTO books(title,author,image) VALUES(?,?,?)`,
        [title, author, image],
        function(err) {
            res.json({ id: this.lastID });
        }
    );
});

// Update book
app.put('/api/books/:id', (req, res) => {
    const { title, author, image } = req.body;

    db.run(
        `UPDATE books SET title=?, author=?, image=? WHERE id=?`,
        [title, author, image, req.params.id],
        () => res.json({ updated: true })
    );
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
    db.run(
        `DELETE FROM books WHERE id=?`,
        [req.params.id],
        () => res.json({ deleted: true })
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});