document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") return;

    const task = { text: taskText, highlighted: false, status: "pending" };
    saveTask(task);
    taskInput.value = "";
    renderTask(task);
}

function renderTask(task) {
    const listId = task.status === "completed" ? "completedList" : task.status === "notCompleted" ? "notCompletedList" : "pendingList";
    const taskList = document.getElementById(listId);

    const li = document.createElement("li");
    if (task.highlighted) li.classList.add("highlighted");

    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="highlight-btn" onclick="highlightTask(this)">Highlight</button>
            <button class="complete-btn" onclick="markCompleted(this)">Complete</button>
            <button class="not-completed-btn" onclick="markNotCompleted(this)">Not Completed</button>
        </div>
    `;
    
    taskList.appendChild(li);
}

function editTask(button) {
    const li = button.closest("li");
    const taskText = li.querySelector(".task-text");
    const newText = prompt("Edit task:", taskText.innerText);

    if (newText !== null && newText.trim() !== "") {
        taskText.innerText = newText;
        updateStorage();
    }
}

function highlightTask(button) {
    const li = button.closest("li");
    li.classList.toggle("highlighted");
    updateStorage();
}

function markCompleted(button) {
    moveTask(button, "completed");
}

function markNotCompleted(button) {
    moveTask(button, "notCompleted");
}

function moveTask(button, newStatus) {
    const li = button.closest("li");
    const taskText = li.querySelector(".task-text").innerText;
    
    li.remove();
    
    const task = { text: taskText, highlighted: li.classList.contains("highlighted"), status: newStatus };
    saveTask(task);
    renderTask(task);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || { pending: [], completed: [], notCompleted: [] };
    tasks[task.status].push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStorage() {
    let tasks = { pending: [], completed: [], notCompleted: [] };

    document.querySelectorAll("#pendingList li").forEach(li => {
        tasks.pending.push({ text: li.querySelector(".task-text").innerText, highlighted: li.classList.contains("highlighted"), status: "pending" });
    });

    document.querySelectorAll("#completedList li").forEach(li => {
        tasks.completed.push({ text: li.querySelector(".task-text").innerText, highlighted: li.classList.contains("highlighted"), status: "completed" });
    });

    document.querySelectorAll("#notCompletedList li").forEach(li => {
        tasks.notCompleted.push({ text: li.querySelector(".task-text").innerText, highlighted: li.classList.contains("highlighted"), status: "notCompleted" });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || { pending: [], completed: [], notCompleted: [] };

    tasks.pending.forEach(renderTask);
    tasks.completed.forEach(renderTask);
    tasks.notCompleted.forEach(renderTask);
}

function clearCompleted() {
    document.getElementById("completedList").innerHTML = "";
    updateStorage();
}
