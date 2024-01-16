const title = document.querySelector("#calendarTitle");
const lastMonthBtn = document.querySelector("#prev");
const nextMonthBtn = document.querySelector("#next");
const todayBtn = document.querySelector(".today-btn");
const dateInput = document.querySelector("#eventDate");
const todoInput = document.querySelector("#eventTitle");
const createModal = bootstrap.Modal.getOrCreateInstance("#exampleModal");
const updateModal = bootstrap.Modal.getOrCreateInstance("#exampleModal");

const today = new Date();
let currentYear;
let currentMonth; // Starts from 1 (January) to 12 (December)

const localStorageKey = "my-todo";
let todoItemObj = {};

todayBtn.addEventListener("click", () => {
  initCalendar();
});

lastMonthBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 1) {
    currentYear--;
    currentMonth = 12;
  }
  showTitle(currentYear, currentMonth);
  renderingCalendar();
});

nextMonthBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 12) {
    currentYear++;
    currentMonth = 1;
  }
  showTitle(currentYear, currentMonth);
  renderingCalendar();
});

document.querySelector("#exampleModal").addEventListener("hidden.bs.modal", () => {
  dateInput.value = getDateStr(today);
  todoInput.value = "";
});

function renderingCalendar() {
  // Implementation similar to the provided demo
  // ...
}

function updateTodo(dateStr, idx, content) {
  // Implementation similar to the provided demo
  // ...
}

function deleteTodo(dateStr, idx) {
  // Implementation similar to the provided demo
  // ...
}

function resetStorage() {
  // Implementation similar to the provided demo
  // ...
}

function getDateStr(date) {
  // Implementation similar to the provided demo
  // ...
}

function initCalendar() {
  // Implementation similar to the provided demo
  // ...
}

function showTitle(year, month) {
  // Implementation similar to the provided demo
  // ...
}

function setTodoToStorage(dateStr, content) {
  // Implementation similar to the provided demo
  // ...
}

function getTodoFromStorage() {
  // Implementation similar to the provided demo
  // ...
}

function createTodo() {
  // Implementation similar to the provided demo
  // ...
}

initCalendar();
