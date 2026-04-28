const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve public folder
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = new sqlite3.Database('./app.db');

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            image TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT,
            description TEXT,
            image TEXT,
            link TEXT
        )
    `);
});

// ---------- Routes for public views --------
app.get('/', (req, res) => {
    db.all("SELECT * FROM pets", [], (err, pets) => {
        if (err) return res.status(500).send('Database error');
        res.render('index', { pets });
    });
});

app.get('/favorites', (req, res) => {
    db.all("SELECT * FROM books", [], (err, books) => {
        if (err) return res.status(500).send('Database error');
        res.render('favorites', { books });
    });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/admin', (req, res) => {
    res.render('admin');
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
    const { name,  image } = req.body;

    db.run(
        `INSERT INTO pets(name,image) VALUES(?,?)`,
        [name, image],
        function(err) {
            res.json({ id: this.lastID });
        }
    );
});

// Update pet
app.put('/api/pets/:id', (req, res) => {
    const { name, type, description, image } = req.body;

    db.run(
        `UPDATE pets SET name=?, image=? WHERE id=?`,
        [name, image, req.params.id],
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
    const { title, author, description, image, link } = req.body;

    db.run(
        `INSERT INTO books(title,author,description,image,link) VALUES(?,?,?,?,?)`,
        [title, author, description, image, link],
        function(err) {
            res.json({ id: this.lastID });
        }
    );
});

// Update book
app.put('/api/books/:id', (req, res) => {
    const { title, author, description, image, link } = req.body;

    db.run(
        `UPDATE books SET title=?, author=?, description=?, image=?, link=? WHERE id=?`,
        [title, author, description, image, link, req.params.id],
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

// View routes
app.get('/', (req, res) => {
    db.all("SELECT * FROM pets", [], (err, pets) => {
        if (err) return res.status(500).send('Database error');
        res.render('index', { pets });
    });
});

app.get('/favorites', (req, res) => {
    db.all("SELECT * FROM books", [], (err, books) => {
        if (err) return res.status(500).send('Database error');
        res.render('favorites', { books });
    });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});