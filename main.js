const localStorageKey = "BOOKSHELF";
let books = [];
document.addEventListener("DOMContentLoaded", () => {
	const inputForm = document.getElementById("inputBook");
	inputForm.addEventListener("submit", (e) => {
		const inputBookTitle = document.getElementById("inputBookTitle").value;
		const inputBookAuthor = document.getElementById("inputBookAuthor").value;
		const inputBookYear = document.getElementById("inputBookYear").value;
		let inputBookComplete = document.querySelector('input[name="complete"]:checked').value;
		if (inputBookComplete === "completed") {
			inputBookComplete = true;
		} else {
			inputBookComplete = false;
		}
		const inputedBook = composeObject(+new Date(), inputBookTitle, inputBookAuthor, inputBookYear, inputBookComplete);
		books.push(inputedBook);
		showBooks(inputedBook);
		e.preventDefault();
	});
	if (isStorageExist()) {
		const serializedData = localStorage.getItem(localStorageKey);
		let data = JSON.parse(serializedData);
		if (data !== null) books = data;
		for (book of books) {
			showBooks(book);
		}
	}
});

function isStorageExist() {
	if (typeof Storage === undefined) {
		alert("Sorry your browser is not supported local storage");
		return false;
	}
	return true;
}

function composeObject(id, title, author, year, isComplete) {
	return {
		id,
		title,
		author,
		year: Number(year),
		isComplete,
	};
}

function saveToStorage() {
	if (isStorageExist()) {
		const parsedData = JSON.stringify(books);
		localStorage.setItem(localStorageKey, parsedData);
	}
}

function showBooks(book) {
	const bookContainer = document.createElement("div");
	bookContainer.classList.add("book-container");
	const titleContainer = document.createElement("div");
	titleContainer.classList.add("title");
	const authorContainer = document.createElement("div");
	authorContainer.classList.add("author");
	const containerButton = document.createElement("div");
	titleContainer.innerText = book.title;
	authorContainer.innerText = `${book.author} - ${book.year}`;
	if (book.isComplete) {
		container = document.getElementById("completeBookshelfList");
		containerButton.append(deleteButton(book.id), unCompletedButton(book.id));
	} else {
		container = document.getElementById("incompleteBookshelfList");
		containerButton.append(deleteButton(book.id), completedButton(book.id));
	}
	bookContainer.append(titleContainer, authorContainer, containerButton);
	container.append(bookContainer);
	document.getElementById("inputBookTitle").value = "";
	document.getElementById("inputBookAuthor").value = "";
	document.getElementById("inputBookYear").value = "";
	document.getElementById("inputBookYear").value = "";
	document.getElementById("isCompleted").checked = false;
	document.getElementById("unCompleted").checked = false;
	saveToStorage();
}

function createButton(buttonTypeClass, eventListener, type) {
	const button = document.createElement("button");
	if (type === false) {
		button.innerText = "Move to completed section";
	} else if (type === true) {
		button.innerText = "Move to uncompleted section";
	} else {
		button.innerText = "Delete";
	}
	button.classList.add(buttonTypeClass);
	button.addEventListener("click", function (event) {
		eventListener(event);
		event.stopPropagation();
	});
	return button;
}

function deleteButton(bookId) {
	return createButton("delete-button", function (event) {
		removeBook(event.target.parentElement.parentElement, bookId);
	});
}

function removeBook(taskElement, bookId) {
	if (confirm("Are you sure want to delete this book? 😥")) {
		for (let i = books.length - 1; i >= 0; --i) {
			if (books[i].id == bookId) {
				books.splice(i, 1);
			}
		}
		taskElement.remove();
		saveToStorage();
	}
}

function completedButton(bookId) {
	return createButton("completed-button", function (event) {
		addToCompletedBook(event.target.parentElement.parentElement, bookId);
	}, false);
}

function unCompletedButton(bookId) {
	return createButton("unCompleted-button", function (event) {
		addToUncompletedBook(event.target.parentElement.parentElement, bookId);
	}, true);
}

function addToCompletedBook(taskElement, bookId) {
	const book = findBookIdFromData(bookId);
	book.isComplete = true;
	showBooks(book);
	taskElement.remove();
}

function addToUncompletedBook(taskElement, bookId) {
	const book = findBookIdFromData(bookId);
	book.isComplete = false;
	showBooks(book);
	taskElement.remove();
}

function findBookIdFromData(bookId) {
	for (book of books) {
		if (book.id == bookId) return book;
	}
	return null;
}

function searching() {
	const searchBook = document.getElementById("search").value.toLowerCase();
	const books = document.querySelectorAll(".book-container");
	Array.from(books).forEach((book) => {
		const textTitle = book.firstElementChild.textContent;
		if (textTitle.toLowerCase().indexOf(searchBook) != -1) {
			book.style.display = "block";
		} else {
			book.style.display = "none";
		}
	});
	document.getElementById("search").value = "";
}

function redirectWebsite() {
	window.open("https://bennibennibenni.com");
}