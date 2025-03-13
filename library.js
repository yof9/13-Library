"use strict";

class Book {
    #id;
    static #stamp = 0;
    constructor(title, author, pages, read) {
        if (new.target === undefined) {
            throw new SyntaxError({
                message: "You must use the 'new' keyword when creating class Book.",
                code: 0,
            });
        }
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = parseInt(read) || 0;
        this.#id = Book.#stamp++;
    }
    readBook(pagesToRead) {
        let unread = this.pages - this.read
        if (pagesToRead > unread) {
            events.emit("error", {   
                    type: "RangeError",
                    message: `pages-to-read(${pagesToRead}) can't possibly exceed
                     the unread-pages(${unread}) out of total-pages(${this.pages}).`,

            });
            return;
        }
        this.read += pagesToRead;
        return this;
    }
    getPagesRead() {
        return this.read;
    }
    static getId(book) {
        return #id in book ? book.#id : null; 
    }
}

// Create Library
class Library {
    static #library = [];

    static addBook(bookLike) {
        try {
            if (Library.#bookIsOwned(bookLike.title, bookLike.author, bookLike.pages)) {
                events.emit("error", {   
                        type: "ValueError",
                        message: `Book(${bookLike}) is already owned`,
    
                });
                return;
            }
        } catch(err) {
            throw valueError(`Got-:(${err}) :- when adding ${bookLike} to library `)
        }

        let book;
        book = bookLike instanceof Book ? bookLike :
                new Book(bookLike.title, bookLike.author, bookLike["pages-total"], bookLike["pages-read"]);

        Library.#library.unshift(book);
        return book;
    }  
    static removeBook(bookId) {
        let index =Library.#library.findIndex((book) => Book.getId(book) === bookId)
        if (index !== -1) {
            return Library.#library.splice(index, 1)
        }
        events.emit("error", {
                type: "ValueError",
                message: "Book doesn't exist",
        });
        return;
    }
    static getBook(bookId) {
        const book = Library.#library.find((book) => Book.getId(book) === bookId);
        if (!book) {
            events.emit("error", {
                type: ValueError,
                message: "Book doesn't exist",
            });
            return;
        }
        return book;
    }
    static getAllBooks() {
        return Library.#library;
    }
    static #bookIsOwned(title, author, pages) {
        return Library.#library.some((book) => {
            return book.title === title && book.author === author && book.pages === pages;
        });
    }
}

/* 
events - a super-basic Javascript (publish subscribe) pattern
Events module by learncode.academy, (edited)
github: https://gist.github.com/learncodeacademy/777349747d8382bfb722
youtube: https://www.youtube.com/watch?v=nQRXi1SVOow&list=PLoYCgNOIyGABs-wDaaxChu82q_xQgUb4f&index=4
*/
const events = {
    events: {},
    on: function (eventName, fn) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
      if (this.events[eventName]) {
        for (let fun of this.events[eventName]) {
          if (fun === fn) {
            this.events[eventName].pop(fun);
            break;
          }
        };
      }
    },
    emit: function (eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(function(fn) {
          fn(data);
        });
      }
    }
  };

const dom = (function (){
    const domCache = {};

    document.addEventListener("DOMContentLoaded", cacheDom);

    function cacheDom () {

        domCache.booksContainer = document.querySelector("div.books");

        domCache.addBookModal = document.querySelector("dialog.dialog-add");
        domCache.readBookModal = document.querySelector("dialog.dialog-read"); 
        
        domCache.readFormSubmitBtn = document.querySelector("button[form='read-form'");

        domCache["form#read-form input"] = document.querySelectorAll("form#read-form input");
        domCache["form#add-form input"] = document.querySelectorAll("form#add-form input");
        events.emit("domCached");
    }
    function get(elmt) {
        return domCache[elmt]
    }
    return {get};
})();

(function pageController(){

    // Create list of test books
    const testBooks = [
    { title: "To Kill a Mockingbird", author: "Harper Lee", "pages-total": 281 },
    { title: "1984", author: "George Orwell", "pages-total": 328 },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", "pages-total": 218 },
    { title: "Pride and Prejudice", author: "Jane Austen", "pages-total": 432 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", "pages-total": 234 },
    { title: "Brave New World", author: "Aldous Huxley", "pages-total": 311 },
    { title: "The Hobbit", author: "J.R.R. Tolkien", "pages-total": 310 },
    { title: "Fahrenheit 451", author: "Ray Bradbury", "pages-total": 158 },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", "pages-total": 1137 },
    { title: "The Chronicles of Narnia", author: "C.S. Lewis", "pages-total": 623 },
    { title: "To the Lighthouse", author: "Virginia Woolf", "pages-total": 209 },
    { title: "Moby Dick", author: "Herman Melville", "pages-total": 635 },
    { title: "Wuthering Heights", author: "Emily Bronte", "pages-total": 416 },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", "pages-total": 256 },
    { title: "The Adventures of Huckleberry Finn", author: "Mark Twain", "pages-total": 366 },
    { title: "The Call of the Wild", author: "Jack London", "pages-total": 144 },
    { title: "The Grapes of Wrath", author: "John Steinbeck", "pages-total": 464 },
    { title: "The Odyssey", author: "Homer", "pages-total": 512 },
    { title: "The Iliad", author: "Homer", "pages-total": 528 },
    { title: "War and Peace", author: "Leo Tolstoy", "pages-total": 1225 }
    ];

    events.on("domCached", init);

    function init() {
    // Add test books to library
        addtestBooksToLibrary();

        //show all test books and listen
        displayAndListenerAdapter();
    }

    function validateForm(btn) {

        const inputs = {};    
        dom.get(`form#${btn.form.id} input`).forEach((input) => {
            switch (input.id) {
                case "title":
                case "author":
    
                    // Don't create property if invalid input for validation later
                    if (input.value.length > 50 || input.value.length < 1) {
                        events.emit("error", {
                                type: "RangeError",
                                message: "Invalid Number of characters",
                                node: input
                            }
                        );
                        inputs.error = true;
                        break;
                    }
    
                    inputs[input.id] = input.value;
                    break;
    
                case "pages-total":
                case "pages-to-read":
    
                    if (!/^(0)*[1-9]\d*$/.test(input.value)) {
                        events.emit("error", {
                                type: "ValueError",
                                message: "Please enter a valid Number",
                                node: input
                            }
                        );
                        inputs.error = true;
                        break;
                    }
    
                    inputs[input.id] = parseInt(input.value);
                    break;
    
                case "pages-read":
                        inputs[input.id] = !/^\d+$/.test(input.value) ? 0 : parseInt(input.value);
                        break;            
            }
        });
    
        if (inputs["pages-tota"] && inputs["pages-read"] > inputs["pages-total"]) {
            events.emit("error", {
                    type: "RangeError",
                    message: `Pages-read(${inputs["pages-read"]})
                     can't exceed pages-total(${inputs["pages-total"]})`,
                    node: btn.form
                }
            );
            inputs.error = true;
        }
    
        return inputs;
    }
    function parseBtn(btn, e) {
        e.preventDefault()
    
        // Form submit         
        if (btn.classList.contains("submit")) {
    
            // Validate form
            const validated = validateForm(btn);
    
            if (btn.form.id === "add-form" && !validated.error) {
    
                // Add book, returns a book like object 
                let added = Library.addBook(validated);
                 added ? 
                    displayAndListenerAdapter([added], dom.get("booksContainer").firstElementChild) :
                    undefined;
            }
            else if (btn.form.id == "read-form" && !validated.error) {
    
                // Find book
                let bookId = parseInt(btn.dataset.id);
                const book = Library.getBook(bookId);

                // Read book
                if (!book || !book.readBook(validated["pages-to-read"])) return;
                // Update book page read Info Display
                const readDisplay = dom.get("booksContainer").
                    querySelector(`.info-wrapper[data-id="${bookId}"] .info.read`);                
    
                readDisplay.textContent = book.getPagesRead();
    
            }
        }
        else if (btn.classList.contains("remove-book")) {
    
            let bookId = parseInt(btn.dataset.id);
            const bookWrapper = btn.parentElement.parentElement
    
            Library.removeBook(bookId) ?
                dom.get("booksContainer").removeChild(bookWrapper) : undefined;
        }
        else if (btn.classList.contains("add-book")) {
            dom.get("addBookModal").showModal();
        }
        else if (btn.classList.contains("dialog-add-close")) {
            dom.get("addBookModal").close();
        }
        else if (btn.classList.contains("read-book")) {
            dom.get("readFormSubmitBtn").dataset.id = btn.dataset.id;
            dom.get("readBookModal").showModal();
        }
        else if (btn.classList.contains("dialog-read-close")) {
            dom.get("readFormSubmitBtn").removeAttribute("data-id");
            dom.get("readBookModal").close();
        }
    }

    function createBookCard(book) {
        if (!(book instanceof Book)) {
            throw TypeError(`cant create book card if ${book} is not instance of ${Book}`);
        }
        const bookCard = document.createElement("div");
        bookCard.classList = "book";
        let id = Book.getId(book);
        bookCard.innerHTML = `
                        <div class="info-wrapper" data-id="${id}">
                                <p class="info strong font-brand">${book.title}</p> 
                                <p>by <span class="info strong font-brand">${book.author}</span></p>
                                <p><span class="info read">${book.read}</span> pages read out of <span class="info">${book.pages}</span></p>
                        </div>
                        <div class="book-btns">
                            <button class="btn btn-primary btn-book read-book" data-id="${id}">Read</button>
                            <button class="btn btn-danger btn-book remove-book" data-id="${id}">remove</button>
                        </div>
                    `;
    return bookCard
    }
    function displayBooks(books) {
        const cards = []
        books.forEach(book => {
            cards.push(createBookCard(book));
        });
        dom.get("booksContainer").prepend(...cards);
    }
    function addBtnListeners(node) {
        node.querySelectorAll(".btn").forEach((btn) => {
            btn.addEventListener("pointerdown", function (e) {
                parseBtn(this, e)
            });
        });
    }
    function displayAndListenerAdapter(bookList, referneceNode) {
    
        // Display books
        displayBooks(bookList || Library.getAllBooks());
    
        // If first run, add Listener to every button, else just add listener to the one book just added
        addBtnListeners(referneceNode?.previousElementSibling || document)
    }

    function addtestBooksToLibrary() {
        testBooks.forEach((book) => {
            Library.addBook(book);
        });
    }
})();

// (function errorLogger(){
//     events.on("error", notify);

    
//     function notify({name, message, node=null}) {
//         // Node has value when error is to displayed as form validation 
//         const errorMessage = createErrorMessage(name, message, node ? "span" : "div");
//         if (node) {
//             node.nextElementSibling.innerHTML = errorMessage;
//             node.addEventListener("input", () =>)
//         }
//         else {

//         }
//     }
//     function createErrorMessage(name, message, nodeType){
//         return `<${nodeType} class="type">${name}</${nodeType}>
//                                     <${nodeType} class="message">${message}</${nodeType}>`;
//     }
// })();


// Create an Error logger function that logs error message
// Add a way to logically display error message 
// Fix close modal bug

// Add a way to add an actual pdf, epub or other format book
// Add a way to display image of book cover
// Add a way to read book in browser
// Add a way to download book
//