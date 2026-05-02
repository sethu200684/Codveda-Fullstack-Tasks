const API_URL = 'http://localhost:3000/api';
let isLoginMode = false;

function toggleMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('form-title').innerText = isLoginMode ? "Login" : "Create Account";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Login" : "Register";
    document.getElementById('toggle-text').innerHTML = isLoginMode ? 
        "Don't have an account? <span>Register here</span>" : 
        "Already have an account? <span>Login here</span>";
}

async function handleAuth() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msgDiv = document.getElementById('message');

    try {
        const endpoint = isLoginMode ? '/login' : '/register';
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            msgDiv.style.color = "green";
            msgDiv.innerText = data.message;
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Save login session
                alert("Success! Welcome to your dashboard.");
            }
        } else {
            msgDiv.style.color = "red";
            msgDiv.innerText = data.error;
        }
    } catch (err) {
        msgDiv.innerText = "Error: Server not reachable.";
    }
}