// Select elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");
const doingLane = document.getElementById("doing-lane");
const doneLane = document.getElementById("done-lane");
const lanes = { todo: todoLane, doing: doingLane, done: doneLane };

// Load tasks from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const storedData = JSON.parse(localStorage.getItem("tasks")) || { todo: [], doing: [], done: [] };
    Object.keys(storedData).forEach(lane => {
        storedData[lane].forEach(text => {
            const task = createTaskElement(text);
            lanes[lane].appendChild(task);
        });
    });
});

// Add new task to "To Do" lane
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const task = createTaskElement(value);
    todoLane.appendChild(task);

    saveTasks();
    input.value = "";
});

// Create a draggable task with delete button
function createTaskElement(text) {
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");

    // Task text
    const taskText = document.createElement("span");
    taskText.textContent = text;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    // Delete logic
    deleteBtn.addEventListener("click", () => {
        newTask.remove();
        saveTasks();
    });

    // Drag events
    newTask.addEventListener("dragstart", () => newTask.classList.add("is-dragging"));
    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
        saveTasks();
    });

    newTask.appendChild(taskText);
    newTask.appendChild(deleteBtn);

    return newTask;
}

// Save tasks (with lanes and order) to localStorage
function saveTasks() {
    const data = {
        todo: getLaneTasks(todoLane),
        doing: getLaneTasks(doingLane),
        done: getLaneTasks(doneLane)
    };
    localStorage.setItem("tasks", JSON.stringify(data));
}

// Helper: Get only task text (ignore delete button)
function getLaneTasks(lane) {
    return [...lane.querySelectorAll(".task span")].map(span => span.textContent);
}
