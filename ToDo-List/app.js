// DOM Elements
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const selectedPriority = document.getElementById('selectedPriority');
const priorityOptions = document.getElementById('priorityOptions');
const themeToggle = document.getElementById('themeToggle');
const filterButtons = document.querySelectorAll('.filter-button');
const sortButtons = document.querySelectorAll('.sort-button');
const toastContainer = document.getElementById('toastContainer');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const remainingTasksEl = document.getElementById('remainingTasks');

// App State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';
let currentSort = { type: 'date', direction: 'desc' };
let currentPriority = 'none';

function init() {
    renderTodos();
    updateStats();
    loadTheme();

    // Event Listeners
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    addButton.addEventListener('click', addTodo);

    selectedPriority.addEventListener('click', () => {
        priorityOptions.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!selectedPriority.contains(e.target) && !priorityOptions.contains(e.target)) {
            priorityOptions.classList.remove('show');
        }
    });

    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', () => {
            const priority = option.dataset.priority;
            updateSelectedPriority(priority);
            priorityOptions.classList.remove('show');
        });
    });

    themeToggle.addEventListener('click', toggleTheme);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTodos();
        });
    });

    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sortType = button.dataset.sort;
            const icon = button.querySelector('i');
            
            if (currentSort.type === sortType) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.type = sortType;
                currentSort.direction = 'desc';
            }
            
            sortButtons.forEach(b => {
                const buttonIcon = b.querySelector('i');
                if (b.dataset.sort === currentSort.type) {
                    buttonIcon.className = `fas fa-arrow-${currentSort.direction === 'asc' ? 'up' : 'down'}`;
                } else {
                    buttonIcon.className = 'fas fa-arrow-down';
                }
            });
            
            renderTodos();
        });
    });
}

function addTodo() {
    const todoText = todoInput.value.trim();
    
    if (!todoText) {
        showToast('Please enter a task', 'error');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: new Date().toISOString(),
        priority: currentPriority
    };
    
    todos.push(todo);
    saveTodos();
    todoInput.value = '';
    updateSelectedPriority('none');
    renderTodos();
    updateStats();
    showToast('Task added successfully', 'success');
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveTodos();
    renderTodos();
    updateStats();
    showToast('Task status updated', 'info');
}

function editTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    const newText = prompt('Edit task:', todo.text);
    
    if (newText !== null && newText.trim()) {
        todos = todos.map(t => {
            if (t.id === id) {
                return { ...t, text: newText.trim() };
            }
            return t;
        });
        
        saveTodos();
        renderTodos();
        showToast('Task updated successfully', 'success');
    }
}

function deleteTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    
    if (todoItem) {
        todoItem.classList.add('fade-out');
        
        setTimeout(() => {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateStats();
            showToast('Task deleted successfully', 'info');
        }, 300);
    }
}

function renderTodos() {
    const filteredTodos = filterTodos(todos);
    const sortedTodos = sortTodos(filteredTodos);
    
    todoList.innerHTML = '';
    
    if (sortedTodos.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    sortedTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item priority-${todo.priority}${todo.completed ? ' completed' : ''}`;
        li.dataset.id = todo.id;
        li.innerHTML = `
            <div class="todo-content">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <span class="todo-date">${formatDate(todo.date)}</span>
            </div>
            <div class="todo-actions">
                <button class="todo-button edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo-button delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        li.style.animationDelay = `${index * 0.05}s`;
        li.classList.add('slide-in');
        
        const checkbox = li.querySelector('.todo-checkbox');
        const editButton = li.querySelector('.edit');
        const deleteButton = li.querySelector('.delete');
        
        checkbox.addEventListener('change', () => toggleTodo(todo.id));
        editButton.addEventListener('click', () => editTodo(todo.id));
        deleteButton.addEventListener('click', () => deleteTodo(todo.id));
        
        todoList.appendChild(li);
    });
}

function filterTodos(todos) {
    switch (currentFilter) {
        case 'active': return todos.filter(todo => !todo.completed);
        case 'completed': return todos.filter(todo => todo.completed);
        default: return todos;
    }
}

function sortTodos(todos) {
    return [...todos].sort((a, b) => {
        if (currentSort.type === 'date') {
            return currentSort.direction === 'asc' 
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        }
        if (currentSort.type === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1, none: 0 };
            return currentSort.direction === 'asc'
                ? priorityOrder[a.priority] - priorityOrder[b.priority]
                : priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
    });
}

function updateSelectedPriority(priority) {
    currentPriority = priority;
    const indicator = selectedPriority.querySelector('.priority-indicator');
    const text = selectedPriority.querySelector('span:last-child');
    indicator.className = `priority-indicator ${priority}`;
    text.textContent = priority === 'none' 
        ? 'No priority' 
        : `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`;
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    remainingTasksEl.textContent = total - completed;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    
    if (date.toDateString() === new Date().toDateString()) {
        return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' 
            : type === 'error' ? 'fa-times-circle' 
            : 'fa-info-circle'} toast-icon"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
}

// Initialize the application
init();