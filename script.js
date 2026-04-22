
let color = document.getElementById("color");
let createBtn = document.getElementById("createBtn");
let list = document.getElementById("list");

// Load notes from local storage on page load
window.onload = () => {
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  savedNotes.forEach((note) => createNote(note));
};

// Create a new note and save it to local storage
createBtn.onclick = () => {
  const note = {
    id: Date.now(), // Unique ID for each note
    content: "",
    color: color.value,
    left: 50,
    top: 60,
  };
  createNote(note);
  saveNoteToLocalStorage(note);
};

// Function to create a note element
function createNote(note) {
  let newNote = document.createElement("div");
  newNote.classList.add("note");
  newNote.setAttribute("data-id", note.id);
  newNote.style.borderColor = note.color;
  newNote.style.left = note.left + "px";
  newNote.style.top = note.top + "px";
  newNote.innerHTML = `
    <span><i class="fa-regular fa-trash-can"></i></span>
    <textarea rows="10" cols="30" placeholder="Write Content...">${note.content}</textarea>
  `;
  list.appendChild(newNote);

  // Add event listeners for delete, drag, and content change
  newNote.querySelector(".fa-trash-can").onclick = () => deleteNote(note.id);
  newNote.querySelector("textarea").oninput = (event) =>
    updateNoteContent(note.id, event.target.value);
  enableDragging(newNote, note.id);
}

// Save a note to local storage
function saveNoteToLocalStorage(note) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Delete a note from local storage and the DOM
function deleteNote(id) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const updatedNotes = notes.filter((note) => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(updatedNotes));
  document.querySelector(`[data-id="${id}"]`).remove();
}

// Update note content in local storage
function updateNoteContent(id, content) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const note = notes.find((note) => note.id === id);
  if (note) note.content = content;
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Enable dragging functionality for the note
function enableDragging(noteElement, noteId) {
  let cursor = { x: 0, y: 0 };
  let initialPosition = { x: 0, y: 0 };

  noteElement.onmousedown = (event) => {
    cursor = { x: event.clientX, y: event.clientY };
    initialPosition = {
      x: noteElement.offsetLeft,
      y: noteElement.offsetTop,
    };

    document.onmousemove = (event) => {
      const dx = event.clientX - cursor.x;
      const dy = event.clientY - cursor.y;
      noteElement.style.left = initialPosition.x + dx + "px";
      noteElement.style.top = initialPosition.y + dy + "px";
    };

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      updateNotePosition(noteId, noteElement.offsetLeft, noteElement.offsetTop);
    };
  };
}

// Update note position in local storage
function updateNotePosition(id, left, top) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const note = notes.find((note) => note.id === id);
  if (note) {
    note.left = left;
    note.top = top;
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}
