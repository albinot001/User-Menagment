# Laravel React User Management

A full-stack web application built with Laravel and React for user management. The application provides functionality for user authentication, CRUD operations on users, and real-time notifications.

## Features

-   User Authentication (Login/Signup)
-   User Management (Create, Read, Update, Delete)
-   Real-time notifications for user actions
-   Protected routes
-   RESTful API with Laravel
-   Modern UI with React
-   Token-based authentication

## Tech Stack

-   **Frontend:**

    -   React
    -   React Router
    -   Axios
    -   Context API for state management
    -   CSS for styling

-   **Backend:**
    -   Laravel
    -   Laravel Sanctum for authentication

## Setup Instructions

### Backend Setup (Laravel)

1. Clone the repository
2. Navigate to the project root directory
3. Install PHP dependencies:
    ```bash
    composer install
    ```
4. Copy .env.example to .env and configure your database:
    ```bash
    cp .env.example .env
    ```
5. Generate application key:
    ```bash
    php artisan key:generate
    ```
6. Run database migrations:
    ```bash
    php artisan migrate
    ```
7. Start the Laravel development server:
    ```bash
    php artisan serve
    ```

### Frontend Setup (React)

1. Navigate to the react directory:
    ```bash
    cd react
    ```
2. Install Node dependencies:
    ```bash
    npm install
    ```
3. Copy .env.example to .env and configure your API URL:
    ```bash
    cp .env.example .env
    ```
4. Start the React development server:
    ```bash
    npm run dev
    ```

## Usage

1. Register a new account or login with existing credentials
2. Navigate to the Users section to manage users
3. Create, edit, or delete users as needed
4. Watch for notification messages that confirm your actions

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
