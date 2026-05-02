const API_URL = 'http://localhost:3000/api';
let isLoginMode = false;

function toggleMode() {
    isLoginMode = !isLoginMode;
    const formTitle = document.getElementById('form-title');
    const authBtn = document.getElementById('auth-btn');
    const toggleText = document.getElementById('toggle-text');

    if (isLoginMode) {
        formTitle.innerText = "Login";
        authBtn.innerText = "Login";
        toggleText.innerHTML = "Don't have an account? <span>Register here</span>";
    } else {
        formTitle.innerText = "Create Account";
        authBtn.innerText = "Register";
        toggleText.innerHTML = "Already have an account? <span>Login here</span>";
    }
}

async function handleAuth() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msgDiv = document.getElementById('message');

    if (!username || !password) {
        msgDiv.style.color = "red";
        msgDiv.innerText = "Please fill in all fields.";
        return;
    }

    try {
        const endpoint = isLoginMode ? '/login' : '/register';
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (isLoginMode && data.token) {
                // Save the JWT for the dashboard to use
                localStorage.setItem('authToken', data.token); 
                window.location.href = 'dashboard.html'; 
            } else {
                msgDiv.style.color = "green";
                msgDiv.innerText = "Registration successful! Please login.";
                toggleMode(); // Switch to login mode automatically
            }
        } else {
            msgDiv.style.color = "red";
            msgDiv.innerText = data.error || "Authentication failed.";
        }
    } catch (err) {
        msgDiv.style.color = "red";
        msgDiv.innerText = "Error: Server not reachable.";
        console.error("Connection error:", err);
    }
}