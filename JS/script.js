const form = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const table = document.getElementById('todo-table');
const deleteAll = document.getElementById('delete-all');
const filterType = document.getElementById('filter-type');
const filterKeyword = document.getElementById('filter-keyword');

let todos =[];

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const task = input.value.trim();
    const date = dateInput.value.trim();

    if (!task || !date)return;

    todos.push({ task, date, status: 'pending' });
    input.value = '';
    dateInput.value = '';
    renderTable();
    saveTodos();
});

deleteAll.addEventListener('click', function () {
    todos = [];
    renderTable();
    saveTodos();
});

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
window.markDone = function(index) {
    todos[index].status = 'Completed';
    filteredTodos = null; 
    renderTable(); 
};

window.removeTodo = function(index){
    todos.splice(index, 1);
    filteredTodos = null;
    renderTable();
    saveTodos();
};
renderTable ();

if (filterType && filterKeyword) {
    filterType.addEventListener('change', renderTable);
    filterKeyword.addEventListener('input', renderTable);
};
