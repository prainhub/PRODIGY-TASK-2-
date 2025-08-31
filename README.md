User Authentication and Employee Management System
Project Overview
This is a full-stack web application designed to demonstrate secure user authentication and a CRUD (Create, Read, Update, Delete) system for managing employee records. The application is built with a Node.js backend and a pure HTML, CSS, and JavaScript frontend.

Key Features
Secure Authentication: User registration and login using JWT (JSON Web Tokens) for session management.

Password Hashing: Passwords are securely hashed using bcrypt before being stored.

Role-Based Access Control: Employee management features are restricted to users with the admin role.

Full CRUD Functionality: Administrators can create, view, update, and delete employee records through a web interface.

Responsive Design: The frontend is built with Tailwind CSS for a clean and responsive user experience.

Technology Stack
Frontend: HTML, JavaScript, Tailwind CSS

Backend: Node.js, Express.js

Authentication: jsonwebtoken, bcrypt

Data Storage: In-memory array (for demonstration purposes)

Getting Started
Follow these steps to get the project up and running on your local machine.

Prerequisites
You need to have Node.js and npm installed on your computer.

Installation
Clone or download the project files.

Navigate to the project directory in your terminal.

Install the required Node.js dependencies by running:

npm install

Running the Application
Start the backend server by running the following command in your terminal:

npm start

The server will start on port 3000.

With the server running, open the index.html file in your web browser.

Usage
Logging In
For security, employee management features are only accessible to an admin user. A default administrator account is already set up for you.

Username: admin

Password: adminpassword

Enter these credentials on the login page to access the full functionality.

Employee Management
Once logged in as an admin, you can perform the following actions:

Create: Use the form to add new employee records.

Read: View all existing employee records in the table.

Update: Click the "Edit" button next to an employee record to populate the form and update their details.

Delete: Click the "Delete" button to remove an employee record.

Note on Data Storage
This application uses an in-memory array to store user and employee data. This means that all data will be lost when the server is restarted. For a production environment, you would replace this with a persistent database like MongoDB, PostgreSQL, or MySQL.
