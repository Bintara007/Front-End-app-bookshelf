// Do your work here...
console.log('Hello, world!');
const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

// Cek apakah localStorage tersedia
function isStorageExist() {
  return typeof(Storage) !== 'undefined';
}

// Simpan data buku ke localStorage
function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

// Ambil data buku dari localStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
  document.dispatchEvent(new Event('ondataloaded'));
}

// Menampilkan buku di rak
function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  for (const book of books) {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');

    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;

    // Event listener untuk tombol pindah status
    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    completeButton.addEventListener('click', function () {
      book.isComplete = !book.isComplete;
      saveData();
      renderBooks();
    });

    // Event listener untuk tombol hapus
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    deleteButton.addEventListener('click', function () {
      books = books.filter(b => b.id !== book.id);
      saveData();
      renderBooks();
    });

    // Menempatkan buku ke rak yang sesuai
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

// Menangani penambahan buku baru
document.getElementById('bookForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = Number(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: Date.now(), // Menggunakan timestamp sebagai ID
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  saveData(); // Simpan data ke localStorage
  renderBooks(); // Render ulang buku
});

// Load data saat halaman dimuat
document.addEventListener('ondataloaded', function () {
  renderBooks();
});

// Panggil fungsi untuk mengambil data dari localStorage
loadDataFromStorage();
