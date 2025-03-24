document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.querySelector(".todo-input");
    const addBtn = document.querySelector(".add-btn");
    const todoList = document.querySelector(".todo-list");
    const tasksLeft = document.querySelector(".tasks-left");
    const clearBtn = document.querySelector(".clear-btn");
    const filterBtns = document.querySelectorAll(".filter-btn");

    addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        addTodo(todoInput.value);
        todoInput.value = "";
    });

    function addTodo(task) {
        if (task.trim() === "") return;

        const todoItem = document.createElement("li");
        todoItem.classList.add("todo-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("todo-checkbox");

        const todoText = document.createElement("span");
        todoText.classList.add("todo-text");
        todoText.textContent = task;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = "🗑";

        todoItem.appendChild(checkbox);
        todoItem.appendChild(todoText);
        todoItem.appendChild(deleteBtn);
        todoList.appendChild(todoItem);

        updateTaskCount();

        checkbox.addEventListener("change", () => {
            todoItem.classList.toggle("completed");
            updateTaskCount();
            filterTodos();
        });

        deleteBtn.addEventListener("click", () => {
            todoItem.remove();
            updateTaskCount();
            filterTodos();
        });

        filterTodos();
    }

    function updateTaskCount() {
        const totalTasks = document.querySelectorAll(".todo-item").length;
        const completedTasks = document.querySelectorAll(".todo-item.completed").length;
        const activeTasks = totalTasks - completedTasks;
        tasksLeft.textContent = `${activeTasks} task(s) left`;
    }

    clearBtn.addEventListener("click", () => {
        document.querySelectorAll(".todo-item.completed").forEach((todo) => todo.remove());
        updateTaskCount();
        filterTodos();
    });

    filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector(".filter-btn.active").classList.remove("active");
            btn.classList.add("active");
            filterTodos();
        });
    });

    function filterTodos() {
        const filter = document.querySelector(".filter-btn.active").getAttribute("data-filter");
        document.querySelectorAll(".todo-item").forEach((todo) => {
            switch (filter) {
                case "all":
                    todo.style.display = "flex";
                    break;
                case "active":
                    todo.style.display = todo.classList.contains("completed") ? "none" : "flex";
                    break;
                case "completed":
                    todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                    break;
            }
        });
    }
});
