const API_URL = 'http://localhost:3000/api/users';

async function loadUsers() {
    const response = await fetch(API_URL);
    const users = await response.json();
    const list = document.getElementById('userList');
    list.innerHTML = '';
    users.forEach(user => {
        list.innerHTML += `<div class="card"><strong>${user.name}</strong> - ${user.role}</div>`;
    });
}

//send new user to the backend
async function addUser() {
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role })
    });
    loadUsers();
}

loadUsers();