// to-do list

// edit button on each card that allows you to  chnage
// all things

// add genre and date added onto each card

// add a way to organize by genre, by read/not-read
// by date added by author, by title or author alphabetically

let myLibrary = [];
let libTable = document.querySelector('#library'); 

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
  item = myLibrary.length - 1;

  if (cardID == '') {
    card = document.createElement('td');
    card.setAttribute('id', myLibrary[item]['bookID']);
  }
  else {
    card = document.getElementById(`${cardID}`);
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

  libTable.appendChild(card);
}

addBtn = document.querySelector('#add_book');
addBtn.addEventListener('click', function() {
  let nextBook = NewBookInfo('', '');
  let newItem = new Book(nextBook.title, nextBook.authorLast, nextBook.authorFirst, nextBook.pages, nextBook.read, nextBook.genre, nextBook.time, nextBook.randBookID);
  newItem.addToLibrary();
  console.log(myLibrary);
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
  let authorLast = document.querySelector(`#${edit}author-last`).value;
  let authorFirst = document.querySelector(`#${edit}author-first`).value;
  let pages = document.querySelector(`#${edit}pages`).value;
  let g = document.querySelector(`#${edit}genre`);
  let genre = g.options[g.selectedIndex].text;
  let currentDate =  new Date();
  let currentDayOfMonth = currentDate.getDate();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let time = currentDayOfMonth + '/' + (currentMonth + 1) + '/' + currentYear;
 
  let read =  document.getElementsByName(`#${edit}read`);
  for (let i = 0; i < read.length; i++){
    if (read[i].checked) {
      read = read[i].value;
      break;
    }
  }

  // figure out how to create new randBookID the first time
  // but if edited, keep the original book ID
  
  let randBookID = '';
  if (currentID == '') {
     randBookID = Math.random().toString(16).substring(7);
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
  
  toggleModal();

  closeWindow.onclick = function() {
    toggleModal();
  }

  // get edited entry info and make edit to card
  editWindow.onclick = function(event) {
    editEntry(event, currentCard, editWindow);
  }

}


function editEntry(event, card, editWindow) {
  editEntryBtn = event.target.closest('.edit-entry');
  if (!editEntryBtn) return;

  cardID = card.getAttribute('id');
  cardIndex = getCardIndex(card);

  let editedBook = NewBookInfo('edit_', cardID);
  console.log(cardIndex);

  // edit entry in myLibrary
  myLibrary[cardIndex]['title'] = editedBook.title;
  myLibrary[cardIndex]['authorLast'] = editedBook.authorLast;
  myLibrary[cardIndex]['authorFirst'] = editedBook.authorFirst;
  myLibrary[cardIndex]['pages'] = editedBook.pages;
  myLibrary[cardIndex]['genre'] = editedBook.genre;
  myLibrary[cardIndex]['read'] = editedBook.read;
  
  // edit card with new book info and close window
  displayBook(cardID);
  editWindow.classList.toggle('show-modal')

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
  changeBtn.classList.add(`${readItems.readClass}`);
  changeBtn.innerHTML = `${readItems.readIcon}<br>${readItems.readName}`;
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

// allow user to drag and drop cards
$( function() {
  $( ".sortable" ).sortable({
    revert: true
  });
  $( ".draggable" ).draggable({
    connectToSortable: ".sortable",
    helper: "clone",
    revert: "invalid"
  });
  $( 'td' ).disableSelection();
} );

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