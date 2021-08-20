let myLibrary = [];
let libTable = document.querySelector('#library');

function Book(title, author, pages, read, bookID) {
   this.title = title;
   this.author = author;
   this.pages = pages;
   this.read = read;
   this.bookID = bookID;
}

Book.prototype.addToLibrary = function() {
  myLibrary.push(this);
}


Book.prototype.deleteFromLibrary = function() {
  myLibrary.splice()
}

function displayBook() {
  item = myLibrary.length - 1;
  card = document.createElement('td');
  
  card.innerHTML = `Title: ${myLibrary[item]['title']}
  <br>
  Author: ${myLibrary[item]['author']}
  <br>
  Pages: ${myLibrary[item]['pages']}
  <br>
  <button class="read">${myLibrary[item]['read']}</button>
  <br>
  <i class="fa fa-trash delete" aria-hidden="true"></i>`;

  card.setAttribute('id', myLibrary[item]['bookID']);
  libTable.appendChild(card);
}

addBtn = document.querySelector('#add_book');
addBtn.addEventListener('click', function() {
  let title = document.querySelector('#title').value;
  let author = document.querySelector('#author').value;
  let pages = document.querySelector('#pages').value;
  let read =  document.getElementsByName('read');
  for (let i = 0; i < read.length; i++){
    if (read[i].checked) {
      read = read[i].value;
      break;
    }
  }
  let randBookID = Math.random().toString(16).substring(7);

  let newItem = new Book(title, author, pages, read, randBookID);
  
  newItem.addToLibrary();
  console.log(myLibrary);
  displayBook();


  // delBtn = document.querySelector('#del_poop');
  // delBtn.addEventListener('click', deleteBook);

});


// delete button


libTable.onclick = function(event) {
  // change read status button
  changeRead(event);
  deleteCard(event);
}

function deleteCard(event) {
  let delBtn = event.target.closest('.delete');
  let currentCard = event.target.closest('td');
  if (!delBtn) return;

  cardID = currentCard.getAttribute('id');
  myCard = getCardIndex(currentCard);
  myLibrary.splice(myCard, 1);
  libTable.removeChild(currentCard);
  console.log(myLibrary);
}


// id has changed to random num, you need to get the id
// then the index of that id, then change the read status in
// the library and on the card using array.indexOf()

function changeRead(event) {
  let changeBtn = event.target.closest('.read');
  let currentCard = event.target.closest('td');
  if (!changeBtn) return;

  myCard = getCardIndex(currentCard);
  
  if (myLibrary[myCard]['read'] == 'Read') {
    myLibrary[myCard]['read'] = 'Not read';
  }
  else {
    myLibrary[myCard]['read'] = 'Read';
  }

  changeBtn.innerHTML = `${myLibrary[myCard]['read']}`;
}

function getCardIndex(card) {
  let myCard = 0;
  cardID = card.getAttribute('id');
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i]['bookID'] == cardID){
      myCard = i;
      break;
    }
  }
  return myCard;
}