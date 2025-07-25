const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const table = document.getElementById('todo-table');
const deleteAll = document.getElementById('delete-all');
const filterWrapper = document.createElement('div');
filterWrapper.className = 'filter-wrapper';

const filterSelect = document.createElement('select');
filterSelect.id = 'filter-select';
filterSelect.className = 'filter-select';
filterSelect.innerHTML = `
  <option value="task">Task</option>
  <option value="date">Date</option>
  <option value="status">Status</option>
`;

const filterInput = document.createElement('input');
filterInput.type = 'text';
filterInput.placeholder = 'Cari berdasarkan...';
filterInput.id = 'filter-input';

const filterBtn = document.createElement('button');
filterBtn.textContent = 'Filter';
filterBtn.id = 'filter-btn';

filterWrapper.appendChild(filterSelect);
filterWrapper.appendChild(filterInput);
filterWrapper.appendChild(filterBtn);

const container = document.querySelector('.container');
if (container) {
  container.insertBefore(filterWrapper, table);
}

let todos = [];
let filteredTodos = null;

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const task = input.value.trim();
  const date = dateInput.value;
  if (!task || !date) return;
  todos.push({ task, date, status: 'Pending' });
  input.value = '';
  dateInput.value = '';
  filteredTodos = null;
  renderTable();
});

deleteAll.addEventListener('click', () => {
  todos = [];
  filteredTodos = null;
  renderTable();
});

filterBtn.addEventListener('click', function() {
  const keyword = filterInput.value.trim().toLowerCase();
  const filterBy = filterSelect.value;
  if (!keyword) {
    filteredTodos = null;
    renderTable();
    return;
  }
  if (filterBy === 'task') {
    filteredTodos = todos.filter(todo => todo.task.toLowerCase().includes(keyword));
  } else if (filterBy === 'date') {
    filteredTodos = todos.filter(todo => todo.date.includes(keyword));
  } else if (filterBy === 'status') {
    filteredTodos = todos.filter(todo => todo.status.toLowerCase().includes(keyword));
  } else {
    filteredTodos = null;
  }
  renderTable();
});

filterInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') filterBtn.click();
});

function renderTable() {
  table.innerHTML = `
    <tr>
      <th>Task</th>
      <th>Date</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  `;
  const data = filteredTodos !== null ? filteredTodos : todos;
  if (data.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4" style="text-align:center;">Tidak ada daftar tugas</td>';
    table.appendChild(row);
    return;
  }
  data.forEach((todo, index) => {
    const realIndex = filteredTodos !== null ? todos.findIndex(t => t === todo) : index;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>${todo.status}</td>
      <td>
        <button class="done" onclick="markDone(${realIndex})">Done</button>
        <button class="delete" onclick="removeTodo(${realIndex})">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

window.markDone = function(index) {
  todos[index].status = 'Completed';
  filteredTodos = null;
  renderTable();
};

window.removeTodo = function(index) {
  todos.splice(index, 1);
  filteredTodos = null;
  renderTable();
};

renderTable();

