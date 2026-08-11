const noteInput = document.getElementById("noteInput");

const addBtn = document.getElementById("addBtn");

const searchInput = document.getElementById("searchInput");

const pinnedNotesContainer = document.getElementById("pinnedNotesContainer");
const allNotesContainer = document.getElementById("allNotesContainer");

const pinnedSection = document.querySelector(".pinned-section");
const allNotesSection = document.querySelector(".all-notes-section");

const emptyState = document.getElementById("emptyState");

const toastContainer = document.getElementById("toastContainer");

const colorOptions = document.querySelectorAll(".color-option");

const colorBtn = document.getElementById("colorBtn");

const colorPicker = document.querySelector(".color-picker");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = themeBtn.querySelector("i");

const body = document.body;

let selectedColor = "#dbeafe";

let tasks = [];
let editingIndex = -1;

themeBtn.addEventListener("click", function () {
    body.classList.toggle("dark");

    const isDark = body.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    themeBtn.innerHTML = `
        <i data-lucide="${isDark ? "sun" : "moon"}"></i>
        `;

    lucide.createIcons();
});


document.addEventListener("keydown", function (event) {
    //console.log("KEY PRESSED:", event.key);

    if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        themeBtn.click();
    }

    if (event.key === "Escape") {
        colorPicker.style.display = "none";
    }

    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        addBtn.click();
    }
});


colorBtn.addEventListener("click", () => {
    if (colorPicker.style.display === "none") {
        colorPicker.style.display = "flex";
    } else {
        colorPicker.style.display = "none";
    }
});


colorOptions.forEach(option => {

    option.style.backgroundColor = option.dataset.color;

    option.addEventListener("click", function () {

        colorOptions.forEach(item => {

            item.classList.remove("selected");

        });

        option.classList.add("selected");

        selectedColor = option.dataset.color;

        colorPicker.style.display = "none";
    });
});


// Helper Functions
function showToast(message, type) {

    const toast = document.createElement("div");

    toast.classList.add("toast", type);

    const toastConfig = {
        success: {
            icon: "check-circle"
        },
        error: {
            icon: "circle-x"
        },
        info: {
            icon: "info"
        }
    };

    toast.innerHTML = `
        <i data-lucide="${toastConfig[type].icon}"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    lucide.createIcons();

    setTimeout(() => {
        toast.classList.add("fade-out");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);
};
 


function renderNotes() {

    pinnedNotesContainer.innerHTML = "";
    allNotesContainer.innerHTML = "";
    emptyState.innerHTML = "";

    if (tasks.length === 0) {

        pinnedSection.style.display = "none";
        allNotesSection.style.display = "none";

        emptyState.innerHTML = `
            <div class="empty-state">
                <i data-lucide="notebook-pen"></i>
                <h3>No Notes Yet</h3>
                <p>Create your first note to get started.</p>
            </div>
        `;
        
        lucide.createIcons();

        return;
    }

    const hasPinned = tasks.some(task => task.pinned);
    const hasNormal = tasks.some(task => !task.pinned);

    pinnedSection.style.display = hasPinned ? "" : "none";
    allNotesSection.style.display = hasNormal ? "" : "none";

    for (let i = 0; i < tasks.length; i++) {
        createNoteTasks(tasks[i], i);
    }

    lucide.createIcons();
};


let createNoteTasks = function (noteTask, index) {
    const note = document.createElement("div");
    note.classList.add("note");

    note.style.backgroundColor = noteTask.color || "#ffffff";

    const p = document.createElement("p");
    p.textContent = noteTask.text;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer");

    const pinBtn = document.createElement("button");
    pinBtn.innerHTML = `<i data-lucide="pin"></i>`;
    pinBtn.classList.add("pinBtn");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = `<i data-lucide="pencil"></i>`;
    editBtn.classList.add("editBtn");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i data-lucide="trash-2"></i>`;
    deleteBtn.classList.add("deleteBtn");

    pinBtn.title = noteTask.pinned ? "Unpin Note" : "Pin Note";

    editBtn.title = "Edit Note";
    deleteBtn.title = "Delete Note";
 
    buttonContainer.appendChild(pinBtn);
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);
    note.appendChild(p);
    note.appendChild(buttonContainer);

    if (noteTask.pinned) {
        pinnedNotesContainer.appendChild(note);
    } else {
        allNotesContainer.appendChild(note);
    };

    if (noteTask.pinned) {
       pinBtn.classList.add("pinned");
    } else {
       pinBtn.classList.remove("pinned");
    };


    pinBtn.addEventListener("click", function () {
        noteTask.pinned = !noteTask.pinned;

        tasks.sort((a, b) => b.pinned - a.pinned);

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderNotes();
    })


    editBtn.addEventListener("click", function () {
        noteInput.value = noteTask.text;

        selectedColor = noteTask.color || "#dbeafe";

        colorOptions.forEach(option => {
            option.classList.remove("selected");

            if (option.dataset.color === selectedColor) {
                option.classList.add("selected");
            }
        });

         editingIndex = index;
         addBtn.textContent = "Update Note";
    });


    deleteBtn.addEventListener("click", function () {

        let result = confirm("Are you sure you want to delete this note?");

        if (result) {
            
            let currentNote = tasks.indexOf(noteTask);
            tasks.splice(currentNote, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));

            renderNotes();

            showToast("Note Deleted", "error");

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
            color: selectedColor,
        }

        tasks.push(newTask);

        showToast("Note Added", "success");

     } else {

        tasks[editingIndex].text = noteInputValue;
        tasks[editingIndex].color = selectedColor;
        
        showToast("Note Updated", "info");
     }
    
     localStorage.setItem("tasks", JSON.stringify(tasks));

     editingIndex = -1;

     addBtn.textContent = "Add Note";

     renderNotes();
     
     noteInput.value = "";
     

});



window.addEventListener("load", function () {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        body.classList.add("dark");

        themeBtn.innerHTML = `<i data-lucide="sun"></i>`;
    } else {

        themeBtn.innerHTML = `<i data-lucide="moon"></i>`;

    };

    lucide.createIcons();

    let arr = localStorage.getItem("tasks");
    let saveNote = JSON.parse(arr);

    if (saveNote === null) {
        return;
    }

    tasks = saveNote;
    renderNotes();
});
