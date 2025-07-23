const form = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const input = document.getElementById('todo-date');
const table = document.getElementById('todo-table');
const deleteAll = document.getElementById('delete-all');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

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
    todos.forEach((todo, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
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

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            todos.splice(index, 1);
            renderTable();
            saveTodos();
        });
    });

    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            todos[index].status = todos[index].status === 'pending' ? 'completed' : 'pending';
            renderTable();
            saveTodos();
        });
    });
}
