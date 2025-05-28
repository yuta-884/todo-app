// main.js - To-Do App Logic
// ES6 Module pattern

// Todo item structure: { id: string, text: string, done: boolean }

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');

// State
let todos = [];

// Initialize the app
function init() {
  loadTodos();
  renderTodos();
  setupEventListeners();
}

// Load todos from localStorage
function loadTodos() {
  const storedTodos = localStorage.getItem('todos');
  todos = storedTodos ? JSON.parse(storedTodos) : [];
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Add a new todo
function addTodo(text) {
  const newTodo = {
    id: Date.now().toString(),
    text: text.trim(),
    done: false
  };
  
  todos.push(newTodo);
  saveTodos();
  renderTodos();
}

// Toggle todo completion status
function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });
  
  saveTodos();
  renderTodos();
}

// Delete a todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Render the todo list
function renderTodos() {
  // Clear the list
  todoList.innerHTML = '';
  
  // Show/hide empty state
  if (todos.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }
  
  // Render each todo
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50';
    if (todo.done) {
      li.classList.add('bg-gray-50');
    }
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.done ? 'not done' : 'done'}`);
    
    // Create text span
    const span = document.createElement('span');
    span.className = 'flex-grow';
    span.textContent = todo.text;
    if (todo.done) {
      span.classList.add('done');
    }
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'ml-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('aria-label', `Delete task "${todo.text}"`);
    
    // Create task content container (checkbox + text)
    const taskContent = document.createElement('div');
    taskContent.className = 'flex items-center flex-grow cursor-pointer';
    taskContent.appendChild(checkbox);
    taskContent.appendChild(span);
    
    // Add event listeners
    taskContent.addEventListener('click', (e) => {
      if (e.target !== checkbox) { // Prevent double-toggling when clicking the checkbox directly
        toggleTodo(todo.id);
        if (!todo.done) { // Only animate when marking as done
          li.classList.add('task-complete-animation');
          setTimeout(() => {
            li.classList.remove('task-complete-animation');
          }, 500);
        }
      }
    });
    
    checkbox.addEventListener('change', () => {
      toggleTodo(todo.id);
      if (checkbox.checked) { // Only animate when marking as done
        li.classList.add('task-complete-animation');
        setTimeout(() => {
          li.classList.remove('task-complete-animation');
        }, 500);
      }
    });
    
    deleteBtn.addEventListener('click', () => {
      deleteTodo(todo.id);
    });
    
    // Assemble the list item
    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Form submission
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (text) {
      addTodo(text);
      todoInput.value = '';
      todoInput.focus();
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
