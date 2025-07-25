document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const dateInput = document.getElementById("date-input");
  const todoList = document.getElementById("todo-list");
  const filterInput = document.getElementById("filter-input");
  const statusFilter = document.getElementById("status-filter");
  const addBtn = document.getElementById("add-btn");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  let tasks = [];

function checkEmptyState() {
  if (todoList.children.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="4" class="no-task">Tidak ada daftar tugas</td>`;
    todoList.appendChild(emptyRow);
  }
}
  addBtn.onclick = () => {
    const task = todoInput.value.trim();
    const date = dateInput.value;
    if (!task || !date) {
      alert("Silahkan masukan tugas dan waktunya");
      return;
    }
    tasks.push({ text: task, date: date, completed: false });
    todoInput.value = "";
    dateInput.value = "";
    renderTasks();
  };

  deleteAllBtn.onclick = () => {
    tasks = [];
    renderTasks();
  };

  filterInput.addEventListener("input", renderTasks);
  statusFilter.addEventListener("change", renderTasks);

  function renderTasks() {
    todoList.innerHTML = "";
    const keyword = filterInput.value.toLowerCase();
    const status = statusFilter.value;
    const todayStr = new Date().toISOString().split("T")[0];
    let found = false;
    tasks.forEach((task, index) => {
      const matchesKeyword = task.text.toLowerCase().includes(keyword);
      let matchesStatus = false;
      switch (status) {
        case "all":
          matchesStatus = true;
          break;
        case "pending":
          matchesStatus = !task.completed;
          break;
        case "completed":
          matchesStatus = task.completed;
          break;
        case "today":
          matchesStatus = task.date === todayStr;
          break;
      }
      if (matchesKeyword && matchesStatus) {
        found = true;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${task.text}</td>
          <td>${task.date}</td>
          <td>${task.completed ? 'Tugas selesai' : 'Menunggu diselesaikan'}</td>
          <td>
            <button class="done" onclick="window.toggleDone(${index})">Done</button>
            <button class="delete" onclick="window.deleteTask(${index})">Delete</button>
          </td>
        `;
        todoList.appendChild(row);
      }
    });
    if (!found) {
      const row = document.createElement("tr");
      row.innerHTML = '<td colspan="4" class="no-task">Tidak ada daftar tugas</td>';
      todoList.appendChild(row);
    }
  }

  window.toggleDone = function(index) {
    tasks[index].completed = true;
    renderTasks();
  };
  window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
  };

  renderTasks();
});
