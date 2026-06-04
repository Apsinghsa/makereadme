# Makereadme

<p align="center">
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
</p>


## Table of Contents

*   [Description](#description)
*   [Features](#features)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Usage](#usage)
*   [Project Structure](#project-structure)
*   [API Endpoints](#api-endpoints)
*   [Technologies Used](#technologies-used)
*   [Deployment](#deployment)

## Description

This project is a web application designed to simplify the creation of comprehensive and professional `README.md` files for GitHub repositories. It leverages artificial intelligence (specifically, the Google Gemini API) to analyze a given codebase, extract key information, and automatically generate a well-structured and informative `README.md` file.

Users simply provide a GitHub repository URL through a user-friendly interface. The application then fetches the repository contents, processes them (filtering out irrelevant files like `node_modules` or build artifacts), and sends the relevant code context to the AI model for analysis and generation. The resulting `README.md` content is then offered for direct download.

## Features

*   **AI-Powered README Generation:** Utilizes the Google Gemini API to intelligently analyze repository code and generate detailed `README.md` content.
*   **Seamless GitHub Integration:** Fetches repository contents directly from GitHub using the GitHub API.
*   **Intelligent File Filtering:** Automatically ignores common development artifacts, dependency directories, and binary files (e.g., `node_modules/`, `dist/`, image files) to focus on relevant source code.
*   **Intuitive Web Interface:** Provides a simple, clean user interface to input a GitHub repository URL.
*   **Direct Download:** The generated `README.md` file is offered for immediate download to the user's machine.
*   **Real-time Progress Indicator:** A loading bar provides visual feedback during the README generation process.

## Getting Started

Follow these instructions to set up and run the Makereadme application on your local machine.

### Prerequisites

Ensure you have the following installed:

*   **Node.js**: LTS version recommended.
*   **npm**: Node Package Manager, which comes bundled with Node.js.
*   **GitHub Personal Access Token**: A token with `repo` scope is required for the server to fetch private repositories or to overcome rate limits on public repositories.
*   **Google Gemini API Key**: An API key for accessing the Google Gemini (Generative AI) service.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Apsinghsa/makereadme.git
    cd makereadme
    ```

2.  **Install Client Dependencies**:
    Navigate to the `client` directory and install the necessary packages:
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies**:
    Navigate to the `server` directory and install the necessary packages:
    ```bash
    cd ../server
    npm install
    ```

4.  **Configure Environment Variables**:
    In the `server` directory, create a `.env` file and add your GitHub Personal Access Token and Google Gemini API Key:
    ```
    GITHUB_TOKEN=your_github_personal_access_token
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

### Usage

1.  **Start the Backend Server**:
    From the `server` directory, run:
    ```bash
    npm run dev
    ```
    This will start the backend server, typically on `http://localhost:3000`.

2.  **Start the Frontend Development Server**:
    In a new terminal, navigate to the `client` directory and run:
    ```bash
    cd client
    npm run dev
    ```
    This will start the frontend development server, typically on `http://localhost:5173`.

3.  **Access the Application**:
    Open your web browser and navigate to `http://localhost:5173`.

4.  **Generate a README**:
    *   Paste the URL of a GitHub repository (e.g., `https://github.com/Apsinghsa/makereadme`) into the input field.
    *   Click the "Generate" button.
    *   The application will fetch the repository, process its contents, and use AI to generate the `README.md`.
    *   Once complete, the generated `README.md` file will be downloaded to your browser.

## Project Structure

The project is organized into `client` and `server` directories, following a typical full-stack architecture.

```
.
├── client/                     # React/Vite Frontend Application
│   ├── public/                 # Static assets (images, icons)
│   ├── src/                    # React source code
│   │   ├── components/         # Reusable UI components (homepage, sidebar, icons)
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # React entry point
│   │   └── ...                 # CSS, other assets
│   ├── package.json            # Frontend dependencies and scripts
│   ├── vite.config.js          # Vite configuration (includes proxy to backend)
│   └── ...
├── server/                     # Node.js/Express.js Backend Application
│   ├── controllers/            # Logic for handling API requests
│   │   └── readmeController.js # Handles README generation request
│   ├── routes/                 # Defines API routes
│   │   └── api.js              # API routes for generation
│   ├── services/               # Core business logic and external integrations
│   │   ├── github/             # GitHub API interaction (files, URL parsing)
│   │   ├── geminiService.js    # Google Gemini API integration
│   │   ├── ai_system_prompt.txt# Prompt for AI README generation
│   │   └── ...                 # Utility functions (combine, pathUtils)
│   ├── index.js                # Main server entry point
│   ├── package.json            # Backend dependencies and scripts
│   └── .env.example            # Example environment variables
├── vercel.json                 # Vercel deployment configuration
└── README.md                   # This README file
```

## API Endpoints

The backend exposes the following API endpoint:

*   **`GET /api/generate`**
    *   **Description**: Triggers the README generation process for a specified GitHub repository.
    *   **Query Parameters**:
        *   `url` (string, **required**): The full URL of the GitHub repository (e.g., `https://github.com/owner/repo-name`).
    *   **Example Request**:
        ```
        GET http://localhost:3000/api/generate?url=https://github.com/Apsinghsa/makereadme
        ```
    *   **Response**:
        *   On success: Returns the generated `README.md` content as plain text (type `text/markdown`).
        *   On failure (HTTP 400/500): Returns a JSON object with an `error` message.

## Technologies Used

### Frontend

*   **React**: A JavaScript library for building user interfaces.
*   **Vite**: A fast build tool for modern web projects.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Axios**: Promise-based HTTP client for the browser and Node.js.
*   **react-markdown**: React component to render Markdown.
*   **react-top-loading-bar**: A React component for a YouTube-like loading bar.

### Backend

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
*   **Google Gemini API (`@google/generative-ai`)**: Official Node.js client library for the Google Gemini API.
*   **Octokit (`@octokit/rest`)**: Official JavaScript client for the GitHub REST API.
*   **`adm-zip`**: A zip implementation for Node.js.
*   **`dotenv`**: Loads environment variables from a `.env` file.
*   **`cors`**: Node.js package for providing a Connect/Express middleware that can be used to enable CORS.
*   **`ignore`**: Utility for matching files against `.gitignore` patterns.

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com/) using the `vercel.json` file.

*   The `client` directory is built as a static application.
*   The `server` directory is deployed as a Node.js serverless function.
*   API requests to `/api/(.*)` are routed to the `server/index.js` function.
*   All other requests are routed to the static assets served by the `client` application.
