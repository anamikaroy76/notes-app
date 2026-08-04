const noteInput = document.querySelector("#noteInput");
const addBtn = document.querySelector("#addBtn");
const searchInput = document.querySelector("#searchInput");
const notesContainer = document.querySelector("#notesContainer");

let tasks = [];
let editingIndex = -1;

function renderNotes(){
    notesContainer.innerHTML = "";
        
    for (let i = 0; i < tasks.length; i++) {
       createNoteTasks(tasks[i], i);
    }
}


let createNoteTasks = function (noteTask, index) {
    let note = document.createElement("div");
    note.classList.add("note");

    let p = document.createElement("p");
    p.textContent = noteTask.text;

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");

    let pinBtn = document.createElement("button");
    //pinBtn.textContent = "Pin";

    if (noteTask.pinned) {
        pinBtn.textContent = "Unpin"
    } else {
        pinBtn.textContent = "Pin"
    }

    pinBtn.classList.add("pinBtn");

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");
 
    buttonContainer.appendChild(pinBtn);
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);
    note.appendChild(p);
    note.appendChild(buttonContainer);
    notesContainer.appendChild(note);

    pinBtn.addEventListener("click", function () {
        noteTask.pinned = !noteTask.pinned;

        tasks.sort((a, b) => b.pinned - a.pinned);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderNotes();
    })

    editBtn.addEventListener("click", function () {
        noteInput.value = noteTask.text;
        editingIndex = index;
        addBtn.textContent = "Update Note";
        //note.remove();
    });

    deleteBtn.addEventListener("click", function () {

        let result = confirm("Are you sure you want to delete this note?");

        if (result) {
            
            let currentNote = tasks.indexOf(noteTask);
            tasks.splice(currentNote, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));

            renderNotes();
        }

    });


};

searchInput.addEventListener("input", function () {
    let searchValue = searchInput.value.toLowerCase();
    let allNotes = document.querySelectorAll(".note");
    
    allNotes.forEach((note) => {
        let p = note.querySelector("p");
        if (p.textContent.toLowerCase().includes(searchValue)) {
            note.style.display = "";
        } else{
            note.style.display = "none";
        };
    });
});


addBtn.addEventListener("click", function () {
    let noteInputValue = noteInput.value.trim();

     if (noteInputValue === "") {
         return alert("Please Enter Your Note");
     };

     if (editingIndex === -1) {

        let newTask = {
          text: noteInputValue,
          pinned: false,
        }

        tasks.push(newTask);

     } else {

        tasks[editingIndex].text = noteInputValue;
     }
    
     localStorage.setItem("tasks", JSON.stringify(tasks));

     editingIndex = -1;

     addBtn.textContent = "Add Note"

     renderNotes();
     
     noteInput.value = "";
});



window.addEventListener("load", function () {
    let arr = localStorage.getItem("tasks");
    let saveNote = JSON.parse(arr);
    if (saveNote === null) {
        return;
    } else{
        tasks = saveNote;
        renderNotes();
    };
});
