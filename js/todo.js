const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoStatusBadge = document.getElementById("todoStatus");

const TODO_STORAGE_KEY = "chronos_todos";

let todos = loadTodos();

function loadTodos() {
  try {
    const raw = localStorage.getItem(TODO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    // localStorage unavailable - todos just won't persist across reloads
  }
}

function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-empty";
    empty.textContent = "No tasks yet — add one above.";
    todoList.append(empty);
  }

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "todo-delete";
    deleteBtn.textContent = "×";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    item.append(checkbox, text, deleteBtn);
    todoList.append(item);
  });

  const remaining = todos.filter((todo) => !todo.done).length;
  todoStatusBadge.textContent =
    remaining === 0 ? "All done" : `${remaining} left`;
  todoStatusBadge.className =
    "status-badge " + (remaining === 0 ? "status-success" : "status-info");
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.push({
    id: Date.now() + Math.random().toString(16).slice(2),
    text: trimmed,
    done: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find((item) => item.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((item) => item.id !== id);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
});

renderTodos();
