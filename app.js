let tasks = [];

document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const taskInput = document.getElementById('task-input');
    const dueDateInput = document.getElementById('task-due-date');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        description: taskInput.value,
        dueDate: dueDateInput.value ? new Date(dueDateInput.value) : null,
        completed: false
    };

    tasks.push(task);
    renderTasks();
    taskInput.value = '';
    dueDateInput.value = '';
});

function renderTasks() {
    const currentWeekTasks = tasks.filter(task => isCurrentWeek(task.dueDate));
    const currentMonthTasks = tasks.filter(task => isCurrentMonth(task.dueDate));

    renderTaskList('current-week-tasks', currentWeekTasks);
    renderTaskList('current-month-tasks', currentMonthTasks);
    renderTaskList('all-tasks', tasks);

    updateStats();
}

function renderTaskList(listId, tasks) {
    const list = document.getElementById(listId);
    list.innerHTML = tasks.map(task => `
        <li class="${task.completed ? 'completed' : ''}">
            <span>${task.description} (Due: ${task.dueDate ? task.dueDate.toLocaleString() : 'No date'})</span>
            <div>
                <span class="complete-icon" onclick="toggleComplete(${task.id})">${task.completed ? '✓' : '☐'}</span>
                <i class="fa fa-trash-o" style="font-size:24px" onclick="deleteTask(${task.id})"></i>
            </div>
        </li>
    `).join('');
}


function toggleComplete(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

function updateStats() {
    const completedCount = tasks.filter(task => task.completed).length;
    const notCompletedCount = tasks.length - completedCount;

    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('not-completed-count').textContent = notCompletedCount;
}

function isCurrentWeek(date) {
    if (!date) return false;
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() + 6));
    return date >= startOfWeek && date <= endOfWeek;
}

function isCurrentMonth(date) {
    if (!date) return false;
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}