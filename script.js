let myLibrary = [];

function Book(title, author, pages, read) {
  newItem = {'title': title, 'author': author, 'pages': pages, 'read': read};
}

function addBookToLibrary(library, item) {
  library.push(item);
}