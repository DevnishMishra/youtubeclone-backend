Video Streaming Platform – Backend

Overview

This is the backend API for the Video Streaming Platform built using Node.js, Express, and MongoDB.

The backend handles:
• Video management
• User authentication
• Likes / dislikes
• Comments system

⸻

Tech Stack
• Node.js
• Express.js
• MongoDB
• Mongoose
• JWT Authentication
• bcrypt

Code structure:
backend
│
├── config
│ └── db.js
│
├── controllers
│ ├── authController.js
│ ├── videoController.js
│ └── commentController.js
│
├── models
│ ├── User.js
│ ├── Video.js
│ └── Comment.js
│
├── routes
│ ├── authRoutes.js
│ ├── videoRoutes.js
│ └── commentRoutes.js
│
├── middleware
│ └── authMiddleware.js
│
└── server.js

Installation:
git clone https://github.com/DevnishMishra/youtubeclone-backend.git
cd backend
npm install

Environment Variables

Create a .env file in the root of the backend folder.

run the frontend npm run dev and start backend by npm start.
