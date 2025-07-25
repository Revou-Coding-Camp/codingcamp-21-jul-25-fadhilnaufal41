
// Ambil elemen DOM
const form = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const table = document.getElementById('todo-table');
const deleteAll = document.getElementById('delete-all');
const filterType = document.getElementById('filter-type');
const filterKeyword = document.getElementById('filter-keyword');

let todos = [];

// Simpan todos ke localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Ambil todos dari localStorage
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}

// Render tabel todo
function renderTable() {
    table.innerHTML = '';
    let filteredTodos = todos;

    if (filterType && filterKeyword) {
        const type = filterType.value;
        const keyword = filterKeyword.value.trim().toLowerCase();
        if (type !== 'all' && keyword) {
            filteredTodos = todos.filter(todo => {
                if (type === 'task') return todo.task.toLowerCase().includes(keyword);
                if (type === 'date') return todo.date.toLowerCase().includes(keyword);
                if (type === 'status') return todo.status.toLowerCase().includes(keyword);
                return true;
            });
        }
    }

    if (filteredTodos.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center;">Tidak ada tugas</td>`;
        table.appendChild(row);
        return;
    }

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>No</th>
        <th>Task</th>
        <th>Date</th>
        <th>Status</th>
        <th>Actions</th>
    `;
    table.appendChild(headerRow);

    let no = 1;
    filteredTodos.forEach((todo, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${no++}</td>
            <td>${todo.task}</td>
            <td>${todo.date}</td>
            <td>${todo.status}</td>
            <td>
                <button class="delete-btn" data-index="${index}">Delete</button>
                <button class="toggle-btn" data-index="${index}">${todo.status === 'pending' ? 'Complete' : 'Undo'}</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Mark todo as done
function markDone(index) {
    todos[index].status = 'Completed';
    renderTable();
    saveTodos();
}

// Remove todo
function removeTodo(index) {
    todos.splice(index, 1);
    renderTable();
    saveTodos();
}

// Event listener untuk tombol di tabel (delete & toggle)
table.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        removeTodo(index);
    } else if (e.target.classList.contains('toggle-btn')) {
        const index = e.target.getAttribute('data-index');
        if (todos[index].status === 'pending') {
            markDone(index);
        } else {
            todos[index].status = 'pending';
            renderTable();
            saveTodos();
        }
    }
});

// Event listener untuk form submit
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const task = todoInput.value.trim();
    const date = dateInput.value.trim();

    if (!task || !date) return;

    todos.push({ task, date, status: 'pending' });
    todoInput.value = '';
    dateInput.value = '';
    renderTable();
    saveTodos();
});

// Event listener untuk hapus semua
deleteAll.addEventListener('click', function () {
    todos = [];
    renderTable();
    saveTodos();
});

// Event listener filter
if (filterType && filterKeyword) {
    filterType.addEventListener('change', renderTable);
    filterKeyword.addEventListener('input', renderTable);
}

// Inisialisasi
loadTodos();
renderTable();
