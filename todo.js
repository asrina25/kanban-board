const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoLane = document.getElementById("todo-lane");
const doingLane = document.getElementById("doing-lane");
const doneLane = document.getElementById("done-lane");
const lanes = { todo: todoLane, doing: doingLane, done: doneLane };

// Load tasks on page load
window.addEventListener("DOMContentLoaded", () => {
    const storedData = JSON.parse(localStorage.getItem("tasks")) || { todo: [], doing: [], done: [] };
    Object.keys(storedData).forEach(lane => {
        storedData[lane].forEach(text => {
            const task = createTaskElement(text);
            lanes[lane].appendChild(task);
        });
    });
});

// Add new task to TO DO by default
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    const task = createTaskElement(value);
    todoLane.appendChild(task);

    saveTasks(); // Save updated state
    input.value = "";
});

// Create draggable task element
function createTaskElement(text) {
    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.textContent = text;

    newTask.addEventListener("dragstart", () => newTask.classList.add("is-dragging"));
    newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
        saveTasks(); // Save new order and lane after drop
    });

    return newTask;
}

// Save all lanes to localStorage
function saveTasks() {
    const data = {
        todo: getLaneTasks(todoLane),
        doing: getLaneTasks(doingLane),
        done: getLaneTasks(doneLane)
    };
    localStorage.setItem("tasks", JSON.stringify(data));
}

// Helper: Get tasks in a lane
function getLaneTasks(lane) {
    return [...lane.querySelectorAll(".task")].map(task => task.textContent);
}
