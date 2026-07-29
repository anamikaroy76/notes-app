const noteInput = document.querySelector("#noteInput");
const addBtn = document.querySelector("#addBtn");
const searchInput = document.querySelector("#searchInput");
const notesContainer = document.querySelector("#notesContainer");

let tasks = [];

let createNoteTasks = function (noteTask) {
    let note = document.createElement("div");
    note.classList.add("note");

    let p = document.createElement("p");
    p.textContent = noteTask
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");
 
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);
    note.appendChild(p)
    note.appendChild(buttonContainer);
    notesContainer.appendChild(note);

    editBtn.addEventListener("click", function () {
        noteInput.value = p.textContent;
        note.remove()
    });

    deleteBtn.addEventListener("click", function () {
        let currentNote = tasks.indexOf(noteTask);
        tasks.splice(currentNote, 1);
        note.remove();
        localStorage.setItem("tasks", JSON.stringify(tasks))
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

    tasks.push(noteInputValue);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    createNoteTasks(noteInputValue);

    noteInput.value = "";
});



window.addEventListener("load", function () {
    let arr = localStorage.getItem("tasks");
    let saveNote = JSON.parse(arr);
    if (saveNote === null) {
        return;
    } else{
        tasks = saveNote;
        for (let i = 0; i < tasks.length; i++) {
            createNoteTasks(tasks[i]);
            
        };
    };
});
