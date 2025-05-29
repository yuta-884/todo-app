// main.js - To-Do App Logic
// ES6 Module pattern

// Todo item structure: { id: string, text: string, done: boolean, createdAt: Date }

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const streakContainer = document.getElementById('streak-container');
const emptyStreak = document.getElementById('empty-streak');
const toggleDateBtn = document.getElementById('toggle-date-btn');
const dateSelector = document.getElementById('date-selector');
const customDateInput = document.getElementById('custom-date');
const toggleViewBtn = document.getElementById('toggle-view-btn');
const currentViewText = document.getElementById('current-view-text');
const tasksContainer = document.getElementById('tasks-container');
const streaksContainer = document.getElementById('streaks-container');
const streakCountBadge = document.getElementById('streak-count-badge');

// State
let todos = [];

// Initialize the app
function init() {
  loadTodos();
  renderTodos();
  renderStreaks();
  setupEventListeners();
  setupMobileViewToggle();
}

// Setup mobile view toggle
function setupMobileViewToggle() {
  if (!toggleViewBtn || !tasksContainer || !streaksContainer) return;
  
  // モバイルビューの初期設定
  function setupInitialView() {
    if (window.innerWidth < 768) {
      // モバイルでは最初にタスク一覧を表示
      tasksContainer.style.display = '';
      streaksContainer.style.display = 'none';
      currentViewText.textContent = 'タスク一覧';
    } else {
      // デスクトップでは両方表示
      tasksContainer.style.display = '';
      streaksContainer.style.display = '';
    }
  }
  
  // 初期表示設定
  setupInitialView();
  
  // 継続記録の件数バッジを更新
  updateStreakCountBadge();
  
  // 切り替えボタンのクリックイベント
  toggleViewBtn.addEventListener('click', function() {
    const isTasksVisible = window.getComputedStyle(tasksContainer).display !== 'none';
    
    if (isTasksVisible) {
      // タスク一覧から継続記録へ切り替え
      tasksContainer.style.display = 'none';
      streaksContainer.style.display = '';
      currentViewText.textContent = '継続記録';
    } else {
      // 継続記録からタスク一覧へ切り替え
      tasksContainer.style.display = '';
      streaksContainer.style.display = 'none';
      currentViewText.textContent = 'タスク一覧';
    }
  });
  
  // リサイズイベント
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
      // デスクトップサイズでは両方表示
      tasksContainer.style.display = '';
      streaksContainer.style.display = '';
    } else {
      // モバイルサイズでは現在のビューを維持
      if (currentViewText.textContent === 'タスク一覧') {
        tasksContainer.style.display = '';
        streaksContainer.style.display = 'none';
      } else {
        tasksContainer.style.display = 'none';
        streaksContainer.style.display = '';
      }
    }
  });
}

// Update streak count badge
function updateStreakCountBadge() {
  if (!streakCountBadge) return;
  
  const streakTodos = getStreakTodos();
  const totalStreaks = streakTodos.length;
  
  if (totalStreaks > 0) {
    streakCountBadge.textContent = `${totalStreaks}件の継続記録`;
    streakCountBadge.style.display = '';
  } else {
    streakCountBadge.style.display = 'none';
  }
}

// Load todos from localStorage
function loadTodos() {
  const storedTodos = localStorage.getItem('todos');
  todos = storedTodos ? JSON.parse(storedTodos) : [];
  
  // Convert string dates back to Date objects
  todos.forEach(todo => {
    if (todo.createdAt) {
      todo.createdAt = new Date(todo.createdAt);
    } else {
      // Add createdAt for older todos that don't have it
      todo.createdAt = new Date();
    }
  });
}

// Save todos to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Check if a todo with the same title exists on the same date
function isDuplicateTodo(text, date) {
  // Normalize the text and date for comparison
  const normalizedText = text.trim().toLowerCase();
  const todoDate = new Date(date);
  todoDate.setHours(0, 0, 0, 0);
  
  // Check if any existing todo has the same text and date
  return todos.some(todo => {
    const existingDate = new Date(todo.createdAt);
    existingDate.setHours(0, 0, 0, 0);
    
    return (
      todo.text.trim().toLowerCase() === normalizedText &&
      existingDate.getTime() === todoDate.getTime()
    );
  });
}

// Add a new todo
function addTodo(text, customDate = null) {
  const todoDate = customDate ? new Date(customDate) : new Date();
  
  // Check for duplicates
  if (isDuplicateTodo(text, todoDate)) {
    // Show error message
    showNotification('同じ日付で同じ積み上げタスクは追加できません', 'error');
    return false;
  }
  
  const newTodo = {
    id: Date.now().toString(),
    text: text.trim(),
    done: false,
    createdAt: todoDate
  };
  
  todos.push(newTodo);
  saveTodos();
  renderTodos();
  renderStreaks();
  return true;
}

// Show notification message
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notification = document.getElementById('notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = 'fixed top-4 right-4 left-4 md:left-auto md:max-w-md p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-y-[-100px] opacity-0';
    document.body.appendChild(notification);
  }
  
  // Set notification style based on type
  if (type === 'error') {
    notification.className = notification.className.replace(/bg-\w+-\d+/g, '');
    notification.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-200');
  } else {
    notification.className = notification.className.replace(/bg-\w+-\d+/g, '');
    notification.classList.add('bg-blue-100', 'text-blue-800', 'border', 'border-blue-200');
  }
  
  // Set message
  notification.textContent = message;
  
  // Show notification
  setTimeout(() => {
    notification.classList.remove('translate-y-[-100px]', 'opacity-0');
    notification.classList.add('translate-y-0', 'opacity-100');
  }, 10);
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('translate-y-0', 'opacity-100');
    notification.classList.add('translate-y-[-100px]', 'opacity-0');
  }, 3000);
}

// Toggle date selector visibility
function toggleDateSelector() {
  dateSelector.classList.toggle('hidden');
  
  // If showing the date selector, set default date to today
  if (!dateSelector.classList.contains('hidden')) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    customDateInput.value = `${year}-${month}-${day}`;
    customDateInput.focus();
  }
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
  renderStreaks();
}

// Delete a todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
  renderStreaks();
}

// Group todos by date
function groupTodosByDate() {
  // Sort todos by createdAt date (newest first)
  const sortedTodos = [...todos].sort((a, b) => b.createdAt - a.createdAt);
  
  // Group by date (ignoring time)
  const groups = {};
  
  sortedTodos.forEach(todo => {
    const date = new Date(todo.createdAt);
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: date,
        todos: []
      };
    }
    
    groups[dateKey].todos.push(todo);
  });
  
  return groups;
}

// Calculate streak for todos with the same text (only counting completed todos with consecutive dates)
function calculateStreak(todoText) {
  if (!todoText) return 0;
  
  // Normalize the text (trim and lowercase)
  const normalizedText = todoText.trim().toLowerCase();
  
  // Get all completed todos with the same text
  const matchingTodos = todos.filter(todo => 
    todo.text.trim().toLowerCase() === normalizedText && todo.done === true
  );
  
  if (matchingTodos.length <= 1) return matchingTodos.length;
  
  // Sort by date (newest first to calculate consecutive streaks properly)
  const sortedByDate = [...matchingTodos].sort((a, b) => b.createdAt - a.createdAt);
  
  // Get unique dates (removing time part)
  const uniqueDatesMap = new Map();
  sortedByDate.forEach(todo => {
    const date = new Date(todo.createdAt);
    date.setHours(0, 0, 0, 0);
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    // Only keep the first occurrence of each date
    if (!uniqueDatesMap.has(dateKey)) {
      uniqueDatesMap.set(dateKey, date);
    }
  });
  
  // Convert to array and sort by date (newest first)
  const uniqueDates = Array.from(uniqueDatesMap.values()).sort((a, b) => b - a);
  
  if (uniqueDates.length <= 1) return uniqueDates.length;
  
  // Calculate consecutive streak starting from the most recent date
  let streak = 1; // Start with the most recent date
  const msPerDay = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const currentDate = uniqueDates[i];
    const nextDate = uniqueDates[i + 1];
    
    // Check if dates are consecutive (1 day apart)
    const daysDifference = Math.round((currentDate - nextDate) / msPerDay);
    
    if (daysDifference === 1) {
      // Dates are consecutive
      streak++;
    } else {
      // Streak is broken
      break;
    }
  }
  
  return streak;
}

// Get all unique todos with streaks (only counting completed todos that are also completed today)
function getStreakTodos() {
  // Create a map to track unique todo texts and their streaks
  const todoMap = new Map();
  
  // Get today's date (without time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // First, find all todo texts that are completed today
  const todayCompletedTexts = new Set();
  todos.filter(todo => {
    // Check if todo is done and created today
    const todoDate = new Date(todo.createdAt);
    todoDate.setHours(0, 0, 0, 0);
    return todo.done && todoDate.getTime() === today.getTime();
  }).forEach(todo => {
    todayCompletedTexts.add(todo.text.trim().toLowerCase());
  });
  
  // Now process all completed todos, but only include those that are also completed today
  todos.filter(todo => todo.done).forEach(todo => {
    const normalizedText = todo.text.trim().toLowerCase();
    
    // Only include in streaks if this todo text is also completed today
    if (todayCompletedTexts.has(normalizedText) && !todoMap.has(normalizedText)) {
      const streak = calculateStreak(todo.text);
      if (streak > 1) {
        todoMap.set(normalizedText, {
          text: todo.text,
          streak: streak,
          lastDate: new Date(todo.createdAt)
        });
      }
    }
  });
  
  // Convert map to array and sort by streak (highest first)
  return Array.from(todoMap.values())
    .sort((a, b) => b.streak - a.streak);
}

// Render the streaks sidebar
function renderStreaks() {
  const streakTodos = getStreakTodos();
  
  // Clear the container
  streakContainer.innerHTML = '';
  
  // Show empty state if no streaks
  if (streakTodos.length === 0) {
    emptyStreak.style.display = '';
    // Update streak count badge
    updateStreakCountBadge();
    return;
  }
  
  // Hide empty state
  emptyStreak.style.display = 'none';
  
  // Sort by streak count (descending)
  streakTodos.sort((a, b) => b.streak - a.streak);
  
  // Create streak items
  streakTodos.forEach(item => {
    const streakItem = document.createElement('div');
    
    // 継続日数に応じた背景グラデーションを適用
    if (item.streak >= 15) {
      // 15日以上: 最も強い強調
      streakItem.className = 'streak-item p-4 rounded-lg border border-indigo-400 bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md mb-3 transition-all hover:shadow-lg streak-item-high';
    } else if (item.streak >= 10) {
      // 10-14日: 強い強調
      streakItem.className = 'streak-item p-4 rounded-lg border border-indigo-300 bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-sm mb-3 transition-all hover:shadow-md';
    } else if (item.streak >= 5) {
      // 5-9日: 中程度の強調
      streakItem.className = 'streak-item p-4 rounded-lg border border-indigo-200 bg-gradient-to-r from-white to-indigo-50 shadow-sm mb-3 transition-all hover:shadow-md';
    } else {
      // 1-4日: 通常の表示
      streakItem.className = 'streak-item p-4 rounded-lg border border-indigo-100 bg-gradient-to-r from-white to-indigo-25 shadow-sm mb-3 transition-all hover:shadow-md';
    }
    
    // タスク名（継続日数に応じて太字と色を強調）
    const todoText = document.createElement('div');
    if (item.streak >= 10) {
      todoText.className = 'font-bold text-gray-900 text-lg';
    } else if (item.streak >= 5) {
      todoText.className = 'font-semibold text-gray-800 text-lg';
    } else {
      todoText.className = 'font-medium text-gray-800 text-lg';
    }
    todoText.textContent = item.text;
    
    // 継続日数表示
    const streakInfo = document.createElement('div');
    streakInfo.className = 'flex items-center mt-3';
    
    // 炎のアイコン（継続を表す）
    const fireIcon = document.createElement('span');
    fireIcon.className = 'mr-2 text-orange-500';
    fireIcon.innerHTML = '🔥';
    
    // 継続日数テキスト（グラデーションテキストで視覚的に魅力的に）
    const streakCount = document.createElement('span');
    
    // 継続日数に応じたスタイルを適用
    if (item.streak >= 10) {
      streakCount.className = 'text-lg font-bold streak-count-high';
    } else if (item.streak >= 5) {
      streakCount.className = 'text-md font-semibold streak-count-medium';
    } else {
      streakCount.className = 'text-md font-medium streak-count-normal';
    }
    
    streakCount.textContent = `${item.streak}日継続中`;
    
    streakInfo.appendChild(fireIcon);
    streakInfo.appendChild(streakCount);
    
    streakItem.appendChild(todoText);
    streakItem.appendChild(streakInfo);
    
    streakContainer.appendChild(streakItem);
  });
  
  // Update streak count badge
  updateStreakCountBadge();
}

// Format date for display
function formatDate(date) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
                  
  const isYesterday = date.getDate() === yesterday.getDate() && 
                      date.getMonth() === yesterday.getMonth() && 
                      date.getFullYear() === yesterday.getFullYear();
  
  if (isToday) {
    return '今日';
  } else if (isYesterday) {
    return '昨日';
  } else {
    // Format as YYYY年MM月DD日
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
}

// Render the todo list
function renderTodos() {
  // Clear the list
  todoList.innerHTML = '';
  
  // Show/hide empty state
  if (todos.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }
  
  // Group todos by date
  const groupedTodos = groupTodosByDate();
  
  // Render each group
  Object.keys(groupedTodos).forEach(dateKey => {
    const group = groupedTodos[dateKey];
    
    // Create date header
    const dateHeader = document.createElement('div');
    dateHeader.className = 'py-2 px-1 mt-4 mb-2 text-sm font-medium text-indigo-600 border-b border-indigo-100 flex items-center';
    
    // Add calendar icon
    const calendarIcon = document.createElement('span');
    calendarIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
    
    dateHeader.appendChild(calendarIcon);
    dateHeader.appendChild(document.createTextNode(formatDate(group.date)));
    todoList.appendChild(dateHeader);
    
    // Create group container
    const groupContainer = document.createElement('div');
    groupContainer.className = 'space-y-2';
    
    // Render todos in this group
    group.todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'task-item flex items-center justify-between p-3 hover:bg-gray-50';
      if (todo.done) {
        li.classList.add('bg-gray-50');
      }
      
      // Create checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500';
      checkbox.checked = todo.done;
      checkbox.setAttribute('aria-label', `「${todo.text}」を${todo.done ? '未完了' : '完了'}にする`);
      
      // Create text span
      const span = document.createElement('span');
      span.className = 'flex-grow';
      span.textContent = todo.text;
      if (todo.done) {
        span.classList.add('done');
      }
      
      // Calculate streak for this todo
      const streak = calculateStreak(todo.text);
      
      // Create streak badge if streak > 1
      let streakBadge = null;
      if (streak > 1) {
        streakBadge = document.createElement('span');
        streakBadge.className = 'ml-2 streak-badge';
        streakBadge.textContent = `${streak}日継続中`;
      }
      
      // Create delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'ml-2 delete-btn rounded-full p-1 focus:outline-none';
      deleteBtn.innerHTML = '🗑️';
      deleteBtn.setAttribute('aria-label', `タスク「${todo.text}」を削除`);
      
      // Create task content container (checkbox + text + streak badge)
      const taskContent = document.createElement('div');
      taskContent.className = 'flex items-center flex-grow cursor-pointer';
      taskContent.appendChild(checkbox);
      taskContent.appendChild(span);
      
      // Add streak badge if exists
      if (streakBadge) {
        taskContent.appendChild(streakBadge);
      }
      
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
      groupContainer.appendChild(li);
    });
    
    todoList.appendChild(groupContainer);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Form submission
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (text) {
      // Check if date is specified
      let customDate = null;
      if (!dateSelector.classList.contains('hidden') && customDateInput.value) {
        customDate = new Date(customDateInput.value);
      }
      
      // Add todo and check if it was successful (not a duplicate)
      const success = addTodo(text, customDate);
      
      // Only clear input and hide date selector if todo was added successfully
      if (success) {
        todoInput.value = '';
        todoInput.focus();
        
        // Hide date selector after adding
        dateSelector.classList.add('hidden');
      }
    }
  });
  
  // Toggle date selector button
  toggleDateBtn.addEventListener('click', toggleDateSelector);
  
  // Make the date input field open the calendar when clicked
  if (customDateInput) {
    customDateInput.addEventListener('click', (e) => {
      // Only open the picker if the click wasn't on the calendar icon
      // This prevents double-triggering the calendar
      const rect = customDateInput.getBoundingClientRect();
      const isClickOnCalendarIcon = e.clientX > rect.right - 40; // 40px is approximate width of the calendar icon
      
      if (!isClickOnCalendarIcon) {
        customDateInput.showPicker();
      }
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
