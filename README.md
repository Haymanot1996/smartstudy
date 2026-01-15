## 🌐 Live Website
This is the live version of the SmartStudy website, where users can access the platform and explore its features online.

 👉 https://smartstudy-5hts.onrender.com/

# SmartStudy - Smart Student Life Manager

## Project Description
SmartStudy is a comprehensive web-based application designed to help students organize their academic and personal lives efficiently. By combining schedule management, task tracking, and resource organization into a single platform, SmartStudy aims to improve productivity and time management for students. The application provides a modern, user-friendly interface to ensure a seamless experience.

## Features
- **User Authentication**: Secure login and registration system for students.
- **Dashboard**: A central hub displaying an overview of tasks, schedules, and important notifications.
- **Schedule Management**: Tools to organize classes, study sessions, and extracurricular activities.
- **Responsive Design**: Accessible on various devices with a modern UI/UX.
- **Data Management**: Efficient handling of user data using a robust backend system.

## Technologies Used
This project utilizes the following technologies:

### Frontend
- **HTML5**: For structuring the web pages.
- **CSS3**: For styling and layout (likely including custom styles or a framework).
- **JavaScript**: For interactive features and dynamic content rendering.

### Backend
- **Node.js**: The runtime environment for executing JavaScript on the server.
- **Express.js**: A web application framework for handling API routes and middleware.

### Database
- **MongoDB**: (via Mongoose) For storing user data and application records.

## Project Folder Structure
The project is organized as follows:

```
SmartStudy/
├── backend/
│   ├── api/                # API routes and controllers
│   ├── frontend/           # Client-side files (HTML, CSS, JS)
│   │   ├── auth/           # Authentication related pages
│   │   ├── scripts/        # Frontend JavaScript logic
│   │   ├── styles/         # CSS spreadsheets
│   │   └── index.html      # Main entry point
│   ├── models/             # Database schemas
│   ├── server.js           # Server entry point
│   └── package.json        # Project dependencies and scripts
├── groupMembers.txt        # List of group members
└── README.md               # Project documentation
```

## Group Members

| No. | Name | Student ID |
|-----|------|------------|
| 1 | Zekariyas Nigus | DDU1600782 |
| 2 | Mulugeta Manjura | DDU1600569 |
| 3 | Haymanot Assefa | RMD1261 |
| 4 | Tsion Regasa | RMD2461 |
| 5 | Bamlaku Ademe | RMD412 |

## How to Run the Project

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (includes npm)
- MongoDB (if running a local database instance)

### Installation Steps
1. **Navigate to the project directory:**
   Open your terminal or command prompt and move to the `backend` folder where the server is located.
   ```bash
   cd backend
   ```

2. **Install Dependencies:**
   Run the following command to install the required Node.js packages:
   ```bash
   npm install
   ```

### Running the Application
1. **Start the Server:**
   Launch the backend server using:
   ```bash
   npm start
   ```
   *Note: If `npm start` is not defined, try `node server.js`.*

2. **Access the Application:**
   Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```
   (Or the port specified in the console output).

---
*This documentation was generated for the SmartStudy project submission.*
