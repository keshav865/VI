
// Selecting HTML elements

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const submitBtn = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter");


// Application state

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let editId = null;


// Save tasks to localStorage

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// Add or update task

taskForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        errorMessage.textContent = "Please enter a task!";
        return;
    }

    errorMessage.textContent = "";

    // Edit existing task

    if (editId !== null) {

        tasks = tasks.map(task => {

            if (task.id === editId) {
                return { ...task, text: text };
            }

            return task;

        });

        editId = null;

        submitBtn.textContent = "Add Task";

    }

    // Add new task

    else {

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);

    }

    taskInput.value = "";

    saveTasks();

    renderTasks();

});


// Display tasks

function renderTasks() {

    taskList.innerHTML = "";

    // Filter tasks

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });


    // Empty message

    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            `<p class="empty-message">No tasks found!</p>`;

    }


    // Create task elements

    filteredTasks.forEach(task => {

        const taskItem = document.createElement("div");

        taskItem.className = "task-item";

        taskItem.innerHTML = `

            <div class="task-content">

                <input
                    type="checkbox"
                    class="complete-checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${task.completed ? "completed" : ""}">
                    ${escapeHTML(task.text)}
                </span>

            </div>

            <div class="task-actions">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>

        `;


        // Complete task

        const checkbox = taskItem.querySelector(".complete-checkbox");

        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });


        // Edit task

        const editButton = taskItem.querySelector(".edit-btn");

        editButton.addEventListener("click", function() {

            taskInput.value = task.text;

            editId = task.id;

            submitBtn.textContent = "Update Task";

            taskInput.focus();

        });


        // Delete task

        const deleteButton = taskItem.querySelector(".delete-btn");

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(t => t.id !== task.id);

            if (editId === task.id) {
                editId = null;
                taskInput.value = "";
                submitBtn.textContent = "Add Task";
            }

            saveTasks();

            renderTasks();

        });


        taskList.appendChild(taskItem);

    });


    updateStats();

}


// Prevent HTML injection through task text

function escapeHTML(text) {

    return text.replace(/[&<>"']/g, function(char) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];

    });

}


// Update statistics

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


// Filter functionality

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();

    });

});

renderTasks();
