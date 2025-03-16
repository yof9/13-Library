"use strict";

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
    off: function (eventName, fn) {
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
            this.events[eventName].forEach(function (fn) {
                fn(data);
            });
        }
    }
};

// Create Book class
class Book {
    #id;
    static #stamp = 0;

    constructor(title, author, pagesTotal, pagesRead) {
        if (new.target === undefined) {
            throw new SyntaxError({
                message: "You must use the 'new' keyword when creating class Book.",
            });
        }
        this.title = title;
        this.author = author;
        this.pagesTotal = parseInt(pagesTotal);
        this.pagesRead = parseInt(pagesRead) || 0;
        this.#id = Book.#stamp++;
    }
    readBook(pagesToRead) {

        let unreadPages = this.pagesTotal - this.pagesRead;
        if (parseInt(pagesToRead) > unreadPages) {
            throw new RangeError(
                `(You can't read(${pagesToRead}) more pages than remaining
                    unread-pages(${unreadPages}) out of total-pages(${this.pagesTotal}).`);
        }

        this.pagesRead += parseInt(pagesToRead);
    }
    static getId(book) {
        return #id in book ? book.#id : null;
    }
}

// Create Library class
class Library {
    static #library = [];

    static addBook(bookLike) {
        if (!bookLike instanceof Object || !bookLike.title ||
            !bookLike.author || !bookLike.pagesTotal instanceof Number) {
            throw new ValueError(`Can't add book(${book}) that doesn't have all required fields.`)
        }
        if (Library.#bookIsOwned(bookLike.title, bookLike.author, bookLike.pagesTotal)) {
            return;
        }

        let book;
        book = bookLike instanceof Book ? bookLike :
            new Book(bookLike.title, bookLike.author, bookLike["pages-total"], bookLike["pages-read"]);

        Library.#library.unshift(book);
        return book;
    }
    static removeBook(bookId) {
        let index = Library.#library.findIndex((book) => Book.getId(book) === bookId)
        if (index !== -1) {
            return Library.#library.splice(index, 1)
        }
    }
    static getBook(bookId) {
        const book = Library.#library.find((book) => Book.getId(book) === bookId);
        if (!book) return;
        return book;
    }
    static getAllBooks() {
        return Library.#library;
    }
    static #bookIsOwned(title, author, pagesTotal) {
        return Library.#library.some((book) => {
            return book.title === title &&
                book.author === author &&
                book.pagesTotal === pagesTotal;
        });
    }
}

// Cache dom IIFE
const dom = (function () {
    const domCache = {};

    document.addEventListener("DOMContentLoaded", cacheDom);

    function cacheDom() {

        // Book Container
        domCache.booksContainer = document.querySelector("div.books");

        // Modals
        domCache.readBookModal = document.querySelector("dialog.dialog-read");
        domCache.addBookModal = document.querySelector("dialog.dialog-add");
        domCache.errorModal = document.querySelector("dialog.dialog-error");


        // Form elmts
        domCache.forms = document.querySelectorAll("form");
        domCache.readForm = domCache.readBookModal.querySelector("form");


        // Form Input elmts
        domCache["read-form input"] = document.querySelectorAll("form#read-form input");
        domCache["add-form input"] = document.querySelectorAll("form#add-form input");

        // Form submit btns
        domCache["add-form [type='submit']"] = domCache.addBookModal.querySelector("button[type='submit']");
        domCache["read-form [type='submit']"] = domCache.readBookModal.querySelector("button[type='submit']");

        // Error Display elmts
        domCache.readModalErrorContainers = domCache.readBookModal.querySelectorAll(".error");
        domCache.errorMain = document.querySelector("main div.error");
        domCache.errorMainBtn = document.querySelector("div.error + button");

        events.emit("domCached");
    }
    function get(elmt) {
        return domCache[elmt]
    }
    return Object.assign({}, { get });
})();

// pageController Logic, IIFE 
(function pageController() {

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

        // Add form submission
        listenToFormSubmission();

        // Add listener to reset modal on closing
        addReadDialogListener();

        // Add Listener to remove main ERROR
        addErrorMainDialogListener();

        //show all test books and listen
        displayAndListenerAdapter();
    }
    function addErrorRemover() {
        dom.get("errorMainBtn").addEventListener("click", (e) => {
            e.preventDefault();
            errorNode.innerHTML = "";
            errorNode.classList.remove("active");
        })
    }

    // Add test books
    function addtestBooksToLibrary() {
        testBooks.forEach((book) => {
            Library.addBook(book);
        });
    }

    // Add form listener
    function listenToFormSubmission() {
        dom.get("forms").forEach((form) => {
            form.addEventListener("submit", function (e) {
                validateForm(e, this)
            });
        });
    }
    function validateForm(e, form) {

        e.preventDefault()

        // Validate form
        const validated = parseInputs(form);

        if (form.id === "add-form" && !validated.error) {

            // Add book, returns a book like object 
            let added = Library.addBook(validated);
            if (added) {
                displayAndListenerAdapter([added], dom.get("booksContainer").firstElementChild)

                // Submit
                events.emit("submitSuccess", form);
                form.submit();
                return;
            }

            events.emit("error", {
                type: "ValueError",
                message: `Book(${bookLike}) is already owned`,
                node: form,
                form: form
            });
        }
        else if (form.id == "read-form" && !validated.error) {

            // Find book
            const formSubmitBtn = dom.get(`${form.id} [type='submit']`);
            let bookId = parseInt(formSubmitBtn.dataset.id);
            const book = Library.getBook(bookId);
            console.log(book, bookId)

            // If not found
            if (!book) {
                events.emit("error", {
                    type: "ValueError",
                    message: `Book not Found.`,
                    node: form,
                    form: form
                });
                return;
            }

            // If invalid pages to be read
            let pagesToRead = parseInt(validated["pages-to-read"]);
            let unread;

            if (pagesToRead > (unread = book.pagesTotal - book.pagesRead)) {
                events.emit("error", {
                    type: "RangeError",
                    message: `Pages to read can't exceed unread(${unread}) pages.`,
                    node: form,
                    form, form
                });
                return;
            }

            // Read book
            book.readBook(pagesToRead);



            // Update book page read Info Display
            const readDisplay = dom.get("booksContainer").
                querySelector(`.info-wrapper[data-id="${bookId}"] .info.read`);

            readDisplay.textContent = book.pagesRead;

            // Submit
            events.emit("submitSuccess", form);
            form.submit();
        }
    }
    function parseInputs(form) {

        const inputs = {};
        dom.get(`${form.id} input`).forEach((input) => {
            switch (input.id) {
                case "title":
                case "author":

                    // Don't create property if invalid input for validation later
                    if (!input.value || input.value.length > 50 || input.value.length < 1) {
                        events.emit("error", {
                            type: "RangeError",
                            message: "Invalid Number of characters",
                            node: input,
                            form: form
                        }
                        );
                        inputs.error = true;
                        break;
                    }

                    inputs[input.id] = input.value;
                    break;

                case "pages-read":
                    if (!/^(0)*[1-9]\d*$/.test(input.value)) {
                        events.emit("error", {
                            type: "ValueError",
                            message: "Please enter a valid Number",
                            node: input,
                            form: form
                        }
                        );
                        inputs.error = true;
                        break;
                    }
                    inputs[input.id] = !/^\d+$/.test(input.value) ? 0 : parseInt(input.value);
                    break;

                case "pages-total":
                case "pages-to-read":

                    if (!input.value || !/^(0)*[1-9]\d*$/.test(input.value)) {
                        events.emit("error", {
                            type: "ValueError",
                            message: "Please enter a valid Number",
                            node: input,
                            form: form
                        }
                        );
                        inputs.error = true;
                        break;
                    }

                    inputs[input.id] = parseInt(input.value);
                    break;
            }
        });

        if (inputs["pages-total"] && inputs["pages-read"] > inputs["pages-total"]) {
            events.emit("error", {
                type: "RangeError",
                message: `Pages-read(${inputs["pages-read"]})
                     can't exceed pages-total(${inputs["pages-total"]})`,
                node: form,
                form: form
            }
            );
            inputs.error = true;
        }

        return inputs;
    }

    // Add read-modal listener
    function addReadDialogListener() {
        dom.get("readBookModal").addEventListener("close", () => {
            dom.get("readForm").reset();
            console.log(dom.get("readModalErrorContainers"))
            dom.get("readModalErrorContainers").forEach(errorContainer => { errorContainer.innerHTML = "" });
        });
    }

    // Error main reseter
    function addErrorMainDialogListener() {
        const errorNode = dom.get("errorMain");
        dom.get("errorMainBtn").addEventListener("click", (e) => {
            e.preventDefault();
            errorNode.innerHTML = "";
            errorNode.classList.remove("active");
            dom.get("errorModal").close();
        })
    }

    // Display-book and btn-listener adapter
    function displayAndListenerAdapter(bookList, referneceNode) {

        // Display books
        displayBooks(bookList || Library.getAllBooks());

        // If first run, add Listener to every button, else just add listener to the one book just added
        addBtnListeners(referneceNode?.previousElementSibling || document)
    }

    function displayBooks(books) {
        const cards = []
        books.forEach(book => {
            cards.push(createBookCard(book));
        });
        dom.get("booksContainer").prepend(...cards);
    }
    function createBookCard(book) {
        if (!(book instanceof Book)) {
            throw new TypeError(`cant create book card if ${book} is not instance of ${Book}`);
        }
        const bookCard = document.createElement("div");
        bookCard.classList = "book";
        let id = Book.getId(book);
        bookCard.innerHTML = `
                        <div class="info-wrapper" data-id="${id}">
                                <p class="info strong font-brand">${book.title}</p> 
                                <p>by <span class="info strong font-brand">${book.author}</span></p>
                                <p><span class="info read">${book.pagesRead}</span> pages read out of <span class="info">${book.pagesTotal}</span></p>
                        </div>
                        <div class="book-btns">
                            <button class="btn btn-primary btn-book read-book" data-id="${id}">Read</button>
                            <button class="btn btn-danger btn-book remove-book" data-id="${id}">remove</button>
                        </div>
                    `;
        return bookCard
    }

    function addBtnListeners(node) {
        node.querySelectorAll(".btn:not([type='submit'])").forEach((btn) => {
            btn.addEventListener("pointerdown", function (e) { parseBtn(this, e) });
        });
    }
    function parseBtn(btn, e) {
        e.preventDefault()

        if (btn.classList.contains("remove-book")) {

            let bookId = parseInt(btn.dataset.id);
            const bookWrapper = btn.parentElement.parentElement

            if (Library.removeBook(bookId)) {
                dom.get("booksContainer").removeChild(bookWrapper)
            }
            else {
                events.emit("error", {
                    type: "ValueError",
                    message: `Book not Found.`
                });
            }
        }
        else if (btn.classList.contains("add-book")) {
            dom.get("addBookModal").showModal();
        }
        else if (btn.classList.contains("dialog-add-close")) {
            dom.get("addBookModal").close();
        }
        else if (btn.classList.contains("read-book")) {
            dom.get("read-form [type='submit']").dataset.id = btn.dataset.id;
            dom.get("readBookModal").showModal();
        }
        else if (btn.classList.contains("dialog-read-close")) {
            dom.get("read-form [type='submit']").dataset.id = "";
            dom.get("readBookModal").close();
        }
    }

})();

// errorLogger Logic, IIFE
(function errorLogger() {
    events.on("error", notify);
    events.on("submitSuccess", removeInputListeners);

    function notify({ type, message, node = null, form = null }) {

        const errorMessage = createErrorMessage(type, message, node ? "span" : "div");

        let errorNode;
        // Parse Nodes
        if (node && form) {

            // If equal then form errorContainer else input errorContainer
            errorNode = node === form ?
                node.firstElementChild.nextElementSibling :
                node.nextElementSibling;

            // Implement Listeners to remove error message later
            addInputListeners(form);
        }
        // Error on main
        else {
            errorNode = dom.get("errorMain");
            dom.get("errorModal").showModal();;
        }

        // Implement error display
        errorNode.innerHTML = errorMessage;
        errorNode.classList.add("active");
    }
    function addInputListeners(form) {
        if (!form.classList.contains("listening-to-input")) {

            dom.get(`${form.id} input`).forEach((input) => {
                input.addEventListener("input", () => { cleanErrorDisplay(form, input) });
            });
            form.classList.add("listening-to-input");
        }
    }
    function removeInputListeners(form) {
        if (form.classList.contains("listening-to-input")) {

            dom.get(`${form.id} input`).forEach((input) => {
                input.removeEventListener("input", () => { cleanErrorDisplay(form, input) });
            });
            form.classList.remove("listening-to-input");
        }
    }
    function cleanErrorDisplay(form, input) {
        let inputErrorNode = input.nextElementSibling;
        let formErrorNode = form.firstElementChild.nextElementSibling;

        // Remove form and input error displays
        inputErrorNode.innerHTML = formErrorNode.innerHTML = "";
        inputErrorNode.className = formErrorNode.className = "error";
    }

    function createErrorMessage(type, message, nodeType) {
        return `<${nodeType} class="type">${type}: &nbsp;</${nodeType}>
                <${nodeType} class="message">${message}</${nodeType}>`;
    }



})();

// Add a way to add an actual book
// Add a way to download book

// Add a way to display image of book cover
// Add a way to read book in browser
