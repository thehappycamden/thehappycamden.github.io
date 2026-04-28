async function loadBooks() {
    const res = await fetch('/api/books');
    const books = await res.json();

    const table = document.getElementById('booksTable');
    table.innerHTML = '';

    books.forEach(b => {
        table.innerHTML += `
        <tr>
            <td><input id="b-title-${b.id}" value="${b.title}"></td>
            <td><input id="b-author-${b.id}" value="${b.author}"></td>
            <td><input id="b-desc-${b.id}" value="${b.description || ''}"></td>
            <td><input id="b-img-${b.id}" value="${b.image}"></td>
            <td><input id="b-link-${b.id}" value="${b.link || ''}"></td>
            <td>
                <button onclick="updateBook(${b.id})">Update</button>
                <button onclick="deleteBook(${b.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}

async function loadPets() {
    const res = await fetch('/api/pets');
    const pets = await res.json();

    const table = document.getElementById('petsTable');
    table.innerHTML = '';

    pets.forEach(p => {
        table.innerHTML += `
        <tr>
            <td><input id="p-name-${p.id}" value="${p.name}"></td>
            <td><input id="p-img-${p.id}" value="${p.image}"></td>
            <td>
                <button onclick="updatePet(${p.id})">Update</button>
                <button onclick="deletePet(${p.id})">Delete</button>
            </td>
        </tr>
        `;
    });
}

async function updateBook(id) {
    const title = document.getElementById(`b-title-${id}`).value;
    const author = document.getElementById(`b-author-${id}`).value;
    const description = document.getElementById(`b-desc-${id}`).value;
    const image = document.getElementById(`b-img-${id}`).value;
    const link = document.getElementById(`b-link-${id}`).value;

    await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, description, image, link })
    });

    alert('Book updated successfully!');
    loadBooks();
}

async function updatePet(id) {
    const name = document.getElementById(`p-name-${id}`).value;
    const image = document.getElementById(`p-img-${id}`).value;

    await fetch(`/api/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image })
    });

    alert('Pet updated successfully!');
    loadPets();
}

async function deleteBook(id) {
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    loadBooks();
}

async function deletePet(id) {
    await fetch(`/api/pets/${id}`, { method: 'DELETE' });
    loadPets();
}

document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('book_description').value;
    const image = document.getElementById('book_image').value;
    const link = document.getElementById('link').value;

    await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, description, image, link })
    });

    alert('Book added successfully!');
    loadBooks();
});

document.getElementById('addPetForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const image = document.getElementById('pet_image').value;

    await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image })
    });

    alert('Pet added successfully!');
    loadPets();
});

loadBooks();
loadPets();