# Code Plagiarism Detector

A full-stack web application designed to help professors detect and manage code plagiarism among student submissions. It utilizes the Levenshtein Distance algorithm to calculate code similarity and provides a comprehensive dashboard for professors to monitor, identify, and compare potentially plagiarized code. Students can submit their assignments through unique space links provided by their professors.

## Table of Contents

*   [Features](#features)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Usage](#usage)
*   [Project Structure](#project-structure)
*   [API Endpoints](#api-endpoints)
*   [How Similarity is Calculated](#how-similarity-is-calculated)
*   [Acknowledgements](#acknowledgements)

## Features

This application provides distinct functionalities for professors and students, focusing on efficient plagiarism detection and management.

### For Professors

*   **Secure Authentication**: Register and log in as a professor to access the system.
*   **Space Management**: Create dedicated "spaces" for different assignments or courses, each with a unique description and start date.
*   **Unique Submission Links**: Automatically generate unique URLs for each space, which can be shared with students for code submission.
*   **Dashboard Overview**: View a list of all created spaces, including their names, descriptions, and the number of student submissions.
*   **Student Submission Monitoring**: Access a detailed view of students within each space, categorized into "Flagged Users" and "Non-Flagged Users."
*   **Plagiarism Flagging**: Students whose code similarity exceeds an 80% threshold with another student's submission are automatically flagged.
*   **Side-by-Side Code Comparison**: Directly compare the code of any two students within a space, particularly useful for analyzing flagged submissions.

### For Students

*   **Simple Submission Interface**: Access a submission form via a unique space link provided by the professor.
*   **Code Submission**: Submit code, along with a roll number and programming language selection.
*   **Instant Similarity Feedback**: Upon submission, receive an immediate report indicating the highest similarity percentage found with another student's code and the roll number of the student they are most similar to.

### Core Functionality

*   **Levenshtein Distance Algorithm**: The core of the plagiarism detection is based on the Levenshtein Distance, which calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one word into the other. This distance is then converted into a similarity percentage.
*   **Database Management**: Utilizes MongoDB to store professor, space, and student submission data, including code, similarity scores, and flagging status.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 14 or higher (recommended).
*   **npm**: Node Package Manager, usually comes with Node.js.
*   **MongoDB**: A running MongoDB instance. You can install it locally or use a cloud service like MongoDB Atlas. The application defaults to `mongodb://localhost:27017/code_plagiarism_detector` if no `MONGODB_URI` environment variable is set.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url> # Replace <repository-url> with the actual URL
    cd Code-Plagiarism-Detector
    ```

2.  **Navigate to the Backend Directory**:
    ```bash
    cd Backend
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```
    This will install all necessary backend packages, including Express, Mongoose, EJS, and Cors.

### Usage

1.  **Start the Backend Server**:
    From the `Backend` directory, run:
    ```bash
    npm start
    ```
    This command uses `nodemon` (as configured in `package.json`) to run `app.js`, which will start the server on `http://localhost:8000`. You should see `Server is running on port 8000` in your console.

2.  **Access the Professor Login Page**:
    Open the following file in your web browser:
    ```
    Frontend/prof_login.html
    ```
    This will load the professor login/registration interface.

3.  **Professor Workflow**:
    *   **Register/Login**: Enter your name, email, and password. If you're a new user, an account will be created. If your email already exists, it will attempt to log you in with the provided password.
    *   **Create a Space**: After logging in, you will be redirected to the Professor Dashboard. Click the "Create space" button. Fill in the space name, description, and start date, then click "Create Space."
    *   **Share Space Link**: On the dashboard, each created space will have a unique link (e.g., `http://localhost:8000/student_signIn/<spaceId>`). Share this link with your students.
    *   **View Submissions**: To view submissions for a specific space, click the "View Space" button next to it on the dashboard. This will display flagged and non-flagged student submissions.
    *   **Compare Codes**: In the student list, for any two students, you can click the "Compare" button to see their code side-by-side along with their similarity percentage.

4.  **Student Workflow**:
    *   **Access Submission Page**: Open the unique space link provided by your professor (e.g., `http://localhost:8000/student_signIn/<spaceId>`) in your web browser.
    *   **Submit Code**: Enter your roll number, paste your code into the provided textarea, and select the programming language from the dropdown.
    *   **View Results**: Click "Submit the code." You will be redirected to a results page showing the similarity percentage with the most similar code and the roll number of that student.

## Project Structure

The project is organized into `Backend` and `Frontend` directories, separating server-side logic and database models from client-side assets and views.

```
.
├── Backend/
│   ├── Models/                     # Mongoose Schemas for database collections
│   │   ├── Professor.js
│   │   ├── Space.js
│   │   └── User.js
│   ├── LdF.js                      # Levenshtein Distance algorithm implementation
│   ├── app.js                      # Main server file, defines routes and logic
│   ├── compare.ejs                 # EJS template for side-by-side code comparison
│   ├── create_space.ejs            # EJS template for creating new spaces
│   ├── package.json                # Backend dependencies and scripts
│   ├── prof_dashboard.ejs          # EJS template for professor's main dashboard
│   ├── prof_user_list.ejs          # EJS template for viewing students in a specific space
│   ├── student_input.ejs           # EJS template for student code submission form
│   ├── student_input.js            # Frontend JS for student input form submission (used by EJS)
│   └── student_result_page.ejs     # EJS template for displaying student submission results
│
├── Frontend/
│   ├── base.css                    # Common CSS for student-facing pages
│   ├── base.html                   # (Potentially unused/older) student base HTML
│   ├── base.js                     # (Potentially unused/older) student base JS
│   ├── prof_base.css               # Common CSS for professor-facing pages
│   ├── prof_base.js                # Frontend JS for professor login form submission
│   ├── prof_login.html             # Professor login/registration HTML page
│   ├── space_base.css              # CSS specific to space creation/management
│   └── space_base.js               # Frontend JS for space creation button (prof dashboard)
│
├── README.md                       # This file
```

## API Endpoints

The backend exposes the following RESTful API endpoints:

### Student Endpoints

*   **`GET /student_signIn/:spaceId`**
    *   **Description**: Renders the student code submission page for a specific space.
    *   **Parameters**: `spaceId` (Path parameter, ID of the space).
    *   **Returns**: HTML page (`student_input.ejs`) for code submission.

*   **`POST /submit-code`**
    *   **Description**: Receives student code submissions, saves them, and calculates similarity against other submissions in the same space and language.
    *   **Request Body (JSON)**:
        ```json
        {
            "code": "console.log('Hello');",
            "roll": "CS001",
            "language": "javascript",
            "space_id": "6543210fedcba"
        }
        ```
    *   **Returns**: HTML page (`student_result_page.ejs`) displaying similarity results.

### Professor Endpoints

*   **`POST /professor/login`**
    *   **Description**: Handles professor login and registration. If the email exists, it attempts to log in; otherwise, it creates a new professor account.
    *   **Request Body (JSON)**:
        ```json
        {
            "name": "Professor John Doe",
            "email": "john.doe@example.com",
            "password": "securepassword"
        }
        ```
    *   **Returns (JSON)**: Professor object on success (status 200), or error message on failure (status 401/500).

*   **`GET /professor/dashboard/:profId`**
    *   **Description**: Renders the professor's dashboard, listing all spaces they have created.
    *   **Parameters**: `profId` (Path parameter, ID of the professor).
    *   **Returns**: HTML page (`prof_dashboard.ejs`) with professor details and created spaces.

*   **`GET /professor/:profId/create_space`**
    *   **Description**: Renders the form page for creating a new space.
    *   **Parameters**: `profId` (Path parameter, ID of the professor).
    *   **Returns**: HTML page (`create_space.ejs`) with the space creation form.

*   **`POST /professor/:profId/create_space`**
    *   **Description**: Creates a new space and associates it with the professor.
    *   **Parameters**: `profId` (Path parameter, ID of the professor).
    *   **Request Body (JSON)**:
        ```json
        {
            "name": "Programming Assignment 1",
            "description": "Code for sorting algorithms",
            "date": "2023-10-26"
        }
        ```
    *   **Returns**: Redirects to the professor's dashboard.

*   **`GET /professor/spaces/:profId`**
    *   **Description**: Retrieves a JSON list of all spaces created by a specific professor.
    *   **Parameters**: `profId` (Path parameter, ID of the professor).
    *   **Returns (JSON)**: An array of space objects.

*   **`GET /space/:spaceId/view`**
    *   **Description**: Renders a page showing all student submissions within a specific space, categorized as flagged and non-flagged.
    *   **Parameters**: `spaceId` (Path parameter, ID of the space).
    *   **Returns**: HTML page (`prof_user_list.ejs`) with student submission details.

*   **`GET /compare/:id1/:id2`**
    *   **Description**: Renders a page comparing the code of two specific student submissions side-by-side.
    *   **Parameters**: `id1` (Path parameter, ID of the first user's submission), `id2` (Path parameter, ID of the second user's submission).
    *   **Returns**: HTML page (`compare.ejs`) displaying the two code snippets and their similarity.

## How Similarity is Calculated

The application calculates code similarity using the **Levenshtein Distance** algorithm (implemented in `Backend/LdF.js`).

1.  **Levenshtein Distance**: This algorithm quantifies the difference between two sequences (in this case, code strings) by counting the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other.
2.  **Similarity Percentage**: The calculated Levenshtein distance (`a1`) is then converted into a similarity percentage using the formula:
    `similarity = (1 - a1 / Math.max(word1.length, word2.length)) * 100`
    The result is rounded to one decimal place.
3.  **Flagging**: If the calculated similarity between two student codes is **80% or higher**, the submission is automatically flagged as potentially plagiarized and highlighted in the professor's dashboard.

## Acknowledgements

*   This project uses **Levenshtein Distance** for core similarity calculation.