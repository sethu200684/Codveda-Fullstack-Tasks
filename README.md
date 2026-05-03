# Codveda Full-Stack Internship Tasks

This repository contains the completed tasks for the Codveda Internship, ranging from web foundations to advanced real-time full-stack applications.

---

## Technical Details

### Key API Endpoints (Level 1 & 2)
* `POST /api/auth/signup` - Register a new user with hashed passwords.
* `POST /api/auth/login` - Authenticate user and return JWT.
* `GET /api/tasks` - Fetch all tasks (Protected Route).

### WebSocket Events (Level 3)
* `send_message`: Client sends a message object to the server.
* `receive_message`: Server broadcasts message to all connected clients.
* `join_room`: Client joins the `internship-updates` channel for targeted notifications.

## Environment Variables
To run this project locally, create a `.env` file in the root directory and add the following:
PORT=8080
DB_HOST=your-aiven-db-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-secure-random-string

---

## Level 1: Web Foundations
### Task 2: Build a Simple REST API
**Status: Completed**
Developed a functional backend service to handle core resource management.
*   **Server Setup:** Configured an Express.js server using Node.js to handle incoming client requests.
*   **CRUD Routes:** Created API endpoints for Create, Read, Update, and Delete operations on resources.
*   **Testing:** Verified all endpoints using Postman to ensure proper HTTP status codes and JSON responses.
*   **Error Handling:** Implemented middleware to handle errors and return appropriate HTTP responses (e.g., 404, 500).

### Task 3: Frontend Integration
**Status: Completed**
Created a dynamic interface that communicates directly with the Level 1 REST API.
*   **Static Layout:** Designed a clean, responsive interface using semantic HTML5 and CSS3.
*   **Data Fetching:** Utilized the JavaScript Fetch API to retrieve data asynchronously from the backend.
*   **Dynamic UI Rendering:** Implemented vanilla JavaScript to update the DOM dynamically based on fetched data without page refreshes.

---

## 💻 Level 2: Intermediate Full-Stack Development

### Task 2: Authentication and Authorization
**Status: Completed**
Implemented a robust security layer to manage user sessions and protect resources.
*   **Identity Management:** Developed signup and login flows with backend data validation.
*   **Password Security:** Integrated `bcrypt` to hash and salt passwords before storing them in the database.
*   **Secure Session Handling:** Implemented **JSON Web Tokens (JWT)** for stateless authentication.
*   **Access Control:** Protected private routes and restricted access based on user roles and token verification.

### Task 3: Database Integration
**Status: Completed**
Connected the application to a persistent cloud database for reliable data management.
*   **Database Management:** Integrated **Aiven MySQL** to handle relational data storage.
*   **Schema Design:** Created models and defined relationships between tables to ensure data consistency.
*   **Performance Optimization:** Implemented database indexing and optimization techniques for faster query execution.
*   **Data Integrity:** Performed strict server-side validation before saving or updating records in the database.

---

## Level 3: Advanced Full-Stack Development

### Task 1: Full-Stack Authentication System
**Status: Completed**
A fully integrated web application featuring secure user authentication and cloud database management.

*   **Tech Stack:** 
    *   **Backend:** Node.js, Express.js
    *   **Database:** Aiven MySQL (Managed Cloud with SSL encryption)
    *   **Hosting:** Railway
    *   **Security:** Password hashing with `bcryptjs` and session management via JWT
*   **Deployment:** [Task 1 Live URL](https://codveda-fullstack-tasks-production.up.railway.app)

### Task 2: Real-Time Communication (WebSockets)
**Status: Completed**
A bidirectional communication system enabling instant data updates without page refreshes.

*   **Technology:** Socket.io (WebSockets)
*   **Key Features:**
    *   **Bidirectional Messaging:** Real-time chat functionality between multiple clients.
    *   **Room-Based Notifications:** Implemented `join_room` logic for targeted user updates (e.g., `internship-updates`).
    *   **Dynamic Connectivity:** Frontend logic automatically detects environment (Local vs. Production) to establish the correct WebSocket handshake.
*   **Optimization:** Minimized data payloads to ensure low-latency performance and high scalability.

---

