// to-do list

// things to fix:
// 1. have it delete the row if it moves up a row
// 2. fix the tdCounter so that it is always correct
//    for the card's position
// 3. look into local storage for library

let myLibrary = [];
let libTable = document.querySelector('#library'); 
let tdCounter = -1;
let totalBooks = document.querySelector('.total-books');
let booksRead = document.querySelector('.books-read');
let bookCounter = 0;
let readCounter = 0;

function Book(title, authorLast, authorFirst, pages, read, genre, time, bookID) {
   this.title = title;
   this.authorLast = authorLast;
   this.authorFirst = authorFirst;
   this.pages = pages;
   this.read = read;
   this.genre = genre;
   this.time = time;
   this.bookID = bookID;
}

Book.prototype.addToLibrary = function() {
  myLibrary.push(this);
}


Book.prototype.deleteFromLibrary = function() {
  myLibrary.splice()
}

function displayBook(cardID) {
  let newCard = false;
  let card = '';
  let item = '';
  if (cardID == '') {
    card = document.createElement('td');
    item = myLibrary.length - 1
    card.setAttribute('id', myLibrary[item]['bookID']);
    newCard = true;
    
  }

  else {
    card = document.getElementById(`${cardID}`);
    item = getCardIndex(card);
  }
  

  readItems = getReadItems(item);

  card.innerHTML = `Title: ${myLibrary[item]['title']}
  <p>
  Author: ${myLibrary[item]['authorLast']}, ${myLibrary[item]['authorFirst']}
  <p>
  Genre: ${myLibrary[item]['genre']}
  <p>
  Pages: ${myLibrary[item]['pages']}
  <p>
  Date added: ${myLibrary[item]['time']}
  <p>
  <button class="${readItems.readClass} read_status">${readItems.readIcon}<br>${readItems.readName}</button>
  <i class="fas fa-edit edit"></i>
  <i class="fa fa-trash delete" aria-hidden="true"></i>`;

  if (newCard == true) {

    // add a new row when there are three cards already in the current row
    if (tdCounter == 3) {
      tr = document.createElement('tr');
      libTable.append(tr);
      tdCounter = 0;
      
    }

    updateBookCounter();
    updateReadCounter();
    libTable.appendChild(card);
  }
  
}

addBtn = document.querySelector('#add_book');
addBtn.addEventListener('click', function() {
  let nextBook = NewBookInfo('', '');
  let newItem = new Book(nextBook.title, nextBook.authorLast, nextBook.authorFirst, nextBook.pages, nextBook.read, nextBook.genre, nextBook.time, nextBook.randBookID);
  newItem.addToLibrary();
  
  displayBook('');
});


// delete button


libTable.onclick = function(event) {
  // change read status button
  
  changeRead(event);
  deleteCard(event);
  editCard(event);
  
}


const NewBookInfo = (edit, currentID) => {
  let title = document.querySelector(`#${edit}title`).value;
  let authorLast = document.querySelector(`#${edit}authorLast`).value;
  let authorFirst = document.querySelector(`#${edit}authorFirst`).value;
  let pages = document.querySelector(`#${edit}pages`).value;
  let g = document.querySelector(`#${edit}genre`);
  let genre = g.options[g.selectedIndex].text;
  let currentDate =  new Date();
  let currentDayOfMonth = currentDate.getDate();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let time = currentDayOfMonth + '/' + (currentMonth + 1) + '/' + currentYear;
  let read = $(`input[name="${edit}read"]:checked`).val();

  // create a random book ID to identify card
  let randBookID = '';
  if (currentID == '') {
     randBookID = Math.random().toString(16).substring(7);
     tdCounter += 1;
  }
  else {
     randBookID = currentID;
  }

  return {title, authorLast, authorFirst, pages, genre, time, read, randBookID}
}

function editCard(event) {
  let editBtn = event.target.closest('.edit');
  let currentCard = event.target.closest('td');
  
  
  if (!editBtn) return;
  
  //add functionality to button and modal window close button
  let editWindow = document.querySelector(".modal");
  let closeWindow = document.querySelector(".close");
  
  function toggleModal () {
    editWindow.classList.toggle('show-modal');
  }

  cardIndex = getCardIndex(currentCard);

  // get new values of card to populate input fields of edit_ elements
  libLoopArr = ['title','authorLast','authorFirst','pages'];
  for (let i = 0; i < libLoopArr.length; i++) {
    document.getElementById(`edit_${libLoopArr[i]}`).value = myLibrary[cardIndex][libLoopArr[i]];
  }
  let edit_read = myLibrary[cardIndex]['read'];
  let edit_genre = myLibrary[cardIndex]['genre'].toLowerCase();

  $(`input[name='edit_read'][value='${edit_read}']`).prop("checked",true);
  $('#edit_genre').val(`${edit_genre}`);

  toggleModal();

  closeWindow.onclick = function() {
    toggleModal();
  }

  cardID = currentCard.getAttribute('id');

  // get edited entry info and make edit to card
  editWindow.onclick = function(event) {
    editEntry(event, cardID, cardIndex, editWindow);
  }

}

function editEntry(event, cardID, cardIndex, editWindow) {
  editEntryBtn = event.target.closest('.edit-entry');
  if (!editEntryBtn) return;

  let editedBook = NewBookInfo('edit_', cardID);

  // edit entry in myLibrary
  myLibrary[cardIndex]['title'] = editedBook.title;
  myLibrary[cardIndex]['authorLast'] = editedBook.authorLast;
  myLibrary[cardIndex]['authorFirst'] = editedBook.authorFirst;
  myLibrary[cardIndex]['pages'] = editedBook.pages;
  myLibrary[cardIndex]['genre'] = editedBook.genre;
  myLibrary[cardIndex]['read'] = editedBook.read;
  
  // edit card with new book info and close window
  displayBook(cardID);
  updateReadCounter();
  editWindow.classList.toggle('show-modal')

}


function deleteCard(event) {
  let delBtn = event.target.closest('.delete');
  let currentCard = event.target.closest('td');
  let currentRow = event.target.closest('tr');
  if (!delBtn) return;


  
  if (myLibrary.length == 0) {
    tdCounter = -1;
  }
 
  if (tdCounter <= 3 && tdCounter > 1) {
    tdCounter -= 1;
  }
  else {
    tdCounter = 3;
    libTable.removeChild(currentRow);
  }


  cardID = currentCard.getAttribute('id');
  myCard = getCardIndex(currentCard);
  myLibrary.splice(myCard, 1);
  updateReadCounter();
  updateBookCounter();
  libTable.removeChild(currentCard);
}


function changeRead(event) {
  let changeBtn = event.target.closest('.read_status');
  let currentCard = event.target.closest('td');
  if (!changeBtn) return;

  myCard = getCardIndex(currentCard);

  if (myLibrary[myCard]['read'] == 'Read') {
    myLibrary[myCard]['read'] = 'Not read';
    changeBtn.classList.remove('read');
  }
  else {
    myLibrary[myCard]['read'] = 'Read';
    changeBtn.classList.remove('not_read');
  }

  
  readItems = getReadItems(myCard);
  
  // update readCounter
  updateReadCounter();

  changeBtn.classList.add(`${readItems.readClass}`);
  changeBtn.innerHTML = `${readItems.readIcon}<br>${readItems.readName}`;
}

function getCardIndex(card) {
  cardID = card.getAttribute('id');
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i]['bookID'] == cardID){
      return i;
    }
  }
}

const getReadItems = (item) => {
  let readIcon = '';
  let readClass = '';
  let readName = '';
  if (myLibrary[item]['read'] == 'Read') {
    readIcon = '<i class="fas fa-book-open"></i>';
    readClass = 'read';
    readName = 'Read';
  }
  else {
    readIcon = '<i class="fas fa-book"></i>';
    readClass = 'not_read';
    readName = 'Not read';
  }
  return {readIcon, readClass, readName};
}


// get numbers for total books and total books read and display

const getBooksRead = () => {
  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i]['read'] == 'Read') {
      readCounter += 1;
    }
  }
  return readCounter;
}

function updateReadCounter() {
  readCounter = 0;
  totalBooksRead = getBooksRead();
  booksRead.innerHTML = `Total read: ${totalBooksRead}`;
}

function updateBookCounter() {
  bookCounter = myLibrary.length;
  totalBooks.innerHTML = `Total books: ${bookCounter}`;
}

// get user name for personalized reading list
$(document).ready(function(){
  userName = window.prompt('Please enter your name');
  userLib = document.querySelector('#userLib');
  if (userName.charAt(userName.length - 1) == 's') {
    userLib.innerHTML = `${userName}' reading list`;
  }
  else {
    userLib.innerHTML = `${userName}'s reading list`;
  }
});

