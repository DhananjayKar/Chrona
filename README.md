# Chrona

[![Live Demo](https://img.shields.io/badge/Live-Demo-1877F2?style=for-the-badge&logo=vercel&logoColor=white)](https://your-live-demo-link.com)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-0F172A?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)
![Node.js](https://img.shields.io/badge/Node.js-233056?style=for-the-badge&logo=node.js&logoColor=green)
![Express](https://img.shields.io/badge/Express.js-111111?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-0E2A1F?style=for-the-badge&logo=mongodb&logoColor=green)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)

---

## About Chrona

**Chrona** is a modern task management web application designed for speed, clarity, and flexibility.  
It allows users to organize tasks by date, reorder them intuitively, and access their tasks from anywhere when signed in.

Chrona also supports **guest mode**, allowing users to try the application instantly before deciding to create an account.

---

## Features

- Create, edit, and delete tasks  
- Optional time scheduling for tasks  
- Toggle task completion  
- Date-based task organization  
- “Today” indicator for quick focus  
- Drag-and-drop task reordering  
- Persistent ordering after refresh  
- Guest mode with localStorage support  
- Import guest tasks into user account  
- Secure authentication using JWT  
- Responsive design for desktop and mobile  
- Smooth UI animations using Framer Motion  

---

## Tech Stack

### Frontend
- React  
- React Router  
- Tailwind CSS  
- Framer Motion  
- DnD Kit (Drag and Drop)

### Backend
- Node.js  
- Express.js  
- MongoDB (Atlas)  
- Mongoose  
- JSON Web Token (JWT)

---

## Authentication Flow

1. User registers or logs in  
2. Backend returns a JWT token  
3. Token is stored in localStorage  
4. Protected routes verify the token via middleware  
5. Tasks are stored in MongoDB per user  

---

## Guest Mode

Chrona allows users to try the application without creating an account.

In guest mode:

- Tasks are stored locally in **localStorage**
- Full task functionality is available
- When the user logs in or registers, guest tasks can be **imported to their account**

---

## Task Reordering

Chrona supports drag-and-drop task ordering.

Order persistence:

- Guest users → stored in **localStorage**
- Signed-in users → stored in **MongoDB**

Tasks include an `order` field used to maintain their position.

---

## Responsive Design

Chrona works smoothly across:

- Desktop
- Tablets
- Mobile devices

---

## Future Improvements

- Task categories / labels  
- Notifications & reminders  
- Dark mode  
- Task sharing  
- Offline support  
- Progressive Web App (PWA)

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Dhananjay Kar**  
MERN Stack Developer

GitHub: https://github.com/DhananjayKar