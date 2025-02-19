"use strict";

function Book(title, author, pages, read) {
    if (!new.target) {
        return;
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read || 0;
    this.id = Book.prototype.id++;
};

Book.prototype = {
    id: 0,
    readBook(pages) {
        let unread = this.pages - this.read
        if (pages > unread) {
            throw new Error(`pages read can't possibly exceed the unread ${unread} pages out of total ${this.pages} pages!!!`)
        }
        this.read += pages;
    }
};

function isOwned(title, author, pages) {
    return library.some((book) => {
        return book.title === title && book.author === author && book.pages === pages;
    });
}

function addBookToLibrary(title, author, pages, read) {
    if (isOwned(title, author, pages)) {
        alert("Book already in library");
        return;
    }
    const book = new Book(title, author, pages, read);
    library.unshift(book);
    return book;
}

function removeBookFromLibrary(id) {
    let index = library.findIndex((book) => book.id === id)
    if (index !== -1) {
        library.splice(index, 1)
        return true;
    }
}

function showBooks(books) {
    const cards = []
    books.forEach(book => {
        const bookCard = document.createElement("div")
        bookCard.classList = "book";
        bookCard.innerHTML = `
                        <div class="info-wrapper">
                                <p class="info strong font-brand">${book.title}</p> 
                                <p>by <span class="info strong font-brand">${book.author}</span></p>
                                <p><span class="info">${book.read}</span> pages read out of <span class="info">${book.pages}</span></p>
                        </div>
                        <div class="book-btns" data-id="${book.id}">
                            <button class="btn btn-primary btn-book read-book">Read</button>
                            <button class="btn btn-danger btn-book remove-book">remove</button>
                        </div>
                    `;
        cards.push(bookCard)
    });
    booksContainer.prepend(...cards);
}

function validateForm(btn) {

    const inputs = {};

    btn.form.querySelectorAll("input").forEach((input) => {
        switch (input.id) {
            case "title":
            case "author":

                // Don't create property if invalid input for validation later
                try {
                    if (input.value.length > 50) throw null;
                    inputs[input.id] = input.value;
                } catch (err) {

                    inputs.error = true;
                    return inputs;
                }

                break;

            case "pages-total":
            case "pages-to-read":

                try {
                    if (!/^(0)*[1-9]\d*$/.test(input.value)) throw null;
                    inputs[input.id] = parseInt(input.value);
                } catch (err) {

                    inputs.error = true;
                    return inputs;
                }

                break;

            case "pages-read":
                try {
                    if (!/^\d+$/.test(input.value)) throw null;
                    inputs[input.id] = parseInt(input.value);
                } catch (err) {
                    inputs[input.id] = 0;
                }

                break;
        }
    });

    return inputs;
}

function parseBtn(btn, e) {
    e.preventDefault()

    // Form submit         
    if (btn.classList.contains("submit")) {

        // Validate form
        const validated = validateForm(btn);

        if (btn.form.id === "add-form") {

            // Add book, returns a book object        
            let added = validated.error || validated["pages-total"] < validated["pages-read"] ?
                undefined :
                addBookToLibrary(
                    validated["title"], validated["author"], validated["pages-total"], validated["pages-read"]
                );

            // If added succesful show the book
            added ? showAndListen([added], booksContainer.firstElementChild) :
                alert("Please fill out the form correctly");

        }
        else if (btn.form.id == "read-form") {

            let bookId = parseInt(btn.form.parentElement.dataset.id);

            // Find book
            const book = library.find((book) => book.id === bookId);

            // Read book
            try {
                validated.error ? alert("Please fill out the form correctly") :
                    book ? book.readBook(validated["pages-to-read"]) :
                        alert("OOPS! Book not found");
            } catch (err) {
                alert(err)
                return;
            }

            let readUpdatableInfo =
                booksContainer.querySelector(`[data-id="${bookId}"]`).previousElementSibling.lastElementChild.firstElementChild;

            readUpdatableInfo.textContent = +readUpdatableInfo.textContent + (validated["pages-to-read"] || 0);

        }
    }
    else if (btn.classList.contains("remove-book")) {

        let bookId = parseInt(btn.parentElement.dataset.id);
        const bookWrapper = btn.parentElement.parentElement

        removeBookFromLibrary(bookId) ?
            booksContainer.removeChild(bookWrapper) :
            alert("Book not found");
    }
    else if (btn.classList.contains("add-book")) {
        addBookModal.showModal();
    }
    else if (btn.classList.contains("dialog-add-close")) {
        addBookModal.close();
    }
    else if (btn.classList.contains("read-book")) {
        readBookModal.dataset.id = btn.parentElement.dataset.id;
        readBookModal.showModal();
    }
    else if (btn.classList.contains("dialog-read-close")) {
        readBookModal.removeAttribute("data-id")
        readBookModal.close();
    }
}

function showAndListen(bookList, referneceNode) {

    // Display books
    showBooks(bookList || library);

    // Add event listener to remove buttons
    (referneceNode?.previousElementSibling || document).querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("pointerdown", function (e) {
            parseBtn(this, e)
        });
    });
}

function testLibrary() {
    testBooks.forEach((book) => {
        addBookToLibrary(book.title, book.author, book.pages);
    });
}

// Create list of test books
const testBooks = [
    { title: "To Kill a Mockingbird", author: "Harper Lee", pages: 281 },
    { title: "1984", author: "George Orwell", pages: 328 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", pages: 218 },
    { title: "Pride and Prejudice", author: "Jane Austen", pages: 432 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", pages: 234 },
    { title: "Brave New World", author: "Aldous Huxley", pages: 311 },
    { title: "The Hobbit", author: "J.R.R. Tolkien", pages: 310 },
    { title: "Fahrenheit 451", author: "Ray Bradbury", pages: 158 },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", pages: 1137 },
    { title: "The Chronicles of Narnia", author: "C.S. Lewis", pages: 623 },
    { title: "To the Lighthouse", author: "Virginia Woolf", pages: 209 },
    { title: "Moby Dick", author: "Herman Melville", pages: 635 },
    { title: "Wuthering Heights", author: "Emily Bronte", pages: 416 },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", pages: 256 },
    { title: "The Adventures of Huckleberry Finn", author: "Mark Twain", pages: 366 },
    { title: "The Call of the Wild", author: "Jack London", pages: 144 },
    { title: "The Grapes of Wrath", author: "John Steinbeck", pages: 464 },
    { title: "The Odyssey", author: "Homer", pages: 512 },
    { title: "The Iliad", author: "Homer", pages: 528 },
    { title: "War and Peace", author: "Leo Tolstoy", pages: 1225 }
];

// Create Library
const library = [];

// Select global nodes
const booksContainer = document.querySelector("div.books");
const addBookModal = document.querySelector("dialog.dialog-add");
const readBookModal = document.querySelector("dialog.dialog-read");

document.addEventListener('DOMContentLoaded', function () {

    // Add test books to library
    testLibrary();

    //show all test books and listen
    showAndListen();
});
