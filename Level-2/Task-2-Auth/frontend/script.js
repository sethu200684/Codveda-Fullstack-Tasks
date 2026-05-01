let isLoginMode = false;
const API_URL = 'http://localhost:3000/api';

function toggleForm(){
    isLoginMode = !isLoginMode;
    document.getElementById('formTitle').innerText = isLoginMode ? 'Login' : 'Create Account';
    document.getElementById('submitBtn').innerText = isLoginMode ? 'Login' : 'Register';
    document.getElementById('toggleText').innerText = isLoginMode ? "Need an account? Register" : "Already have an account? Login";
}

async function handleAuth(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const msgDiv = document.getElementById('message');

    msgDiv.innerText = ""; 

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
                localStorage.setItem('authToken', data.token);
                alert("Welcome! Redirecting...");
            }
        } else {
            // This will display your new "Username too short" or "Password weak" errors
            msgDiv.style.color = "red";
            msgDiv.innerText = data.error; 
        }
    } catch (error) {
        msgDiv.innerText = "Connection failed. Is the server running?";
    }
}