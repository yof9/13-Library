const library = [];
let booksDiv = document.querySelector("div.books");
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
function testLibrary(){
    testBooks.forEach((book) =>{
        addBookToLibrary(book.title, book.author, book.pages);
    });    
    console.log("done adding books")
}
function isOwned(title, author, pages) {
    return library.some((book) => {
        return book.title === title && book.author === author && book.pages === pages;
    });
}

function Book(title, author, pages){
    if (!new.target) {
        return;
    }
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.id = Book.prototype.id++; 
};
Book.prototype = {
    id : 0,
    info(){
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? "read" : "not read yet"}`;
    },
    read(){
        this.read = true;
        return `You are reading ${this.title}`;
    }
};

function addBookToLibrary(title, author, pages){
    if (isOwned(title, author, pages)){
        console.log("Book already in library");
        return;
    }
    const book = new Book(title, author, pages);
    library.push(book); 
}
function removeBookFromLibrary(id){
    let index = library.findIndex((book) => book.id === id)
    if (index !== -1) {
        library.splice(index, 1)
        return true;
    }
}
function showBooks(){
    library.forEach(book => {
        let card = `<div class="book" data-id="${book.id}">
                        <div class="info">${book.title} by ${book.author}, ${book.pages} pages</div>
                        <div class="book-btns">
                            <button class="btn book-btn read">O</button>
                            <button class="btn book-btn status">i</button>
                            <button class="btn book-btn remove">X</button>
                        </div>
                    </div>`;
        booksDiv.innerHTML += card;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Add test books to library
    testLibrary();

    // Display books
    showBooks();

    // Add event listener to remove buttons
    document.querySelectorAll(".btn.book-btn").forEach((btn) => {
        btn.addEventListener("pointerdown", function(){
            
            let id = parseInt(this.parentElement.getAttribute("data-id"));
            
            // remove
            if (this.classList.contains("remove")) {
                removeBookFromLibrary(id) ?
                    booksDiv.removeChild(this.parentElement) : 
                    console.log("Book not found");
            }

            // read
            else if (this.classList.contains("read")) {
                let book = library.find((book) => book.id === id);
                if (book) {
                    console.log(book.read());
                    setTimeout(() => {
                        console.log(`${book.info()}`)
                    }, 5000);
                }
                else {
                    console.log("Book not found");
                }
            }
        });
    });
});