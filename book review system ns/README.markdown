# Book Review system

## Overview
The Book Review system is a RESTful API built with Node.js and Express, designed to manage books and user reviews.

## Requirements
- Node.js (v14 or higher)
- MongoDB (running locally or via a cloud service like MongoDB Atlas)
- npm (Node Package Manager)

# Setup 

# 1. Clone the Repository
Clone this project to your  machine:


# 2. TO Install Dependencies

npm install
```

## 3. Configure Environment Variables
create the .env file globally 
PORT=3000
MONGODB_URI=mongodb://localhost:27017/book-review-system
JWT_SECRET=yourjwt

# 4. Start MongoDB
LOcallyor use cluster created on official website

# 5. Run the Server
node server.js
output 
Connected to MongoDB
Server running on port 3000


## API Endpoints

Authentication
- **POST /api/auth/signup**  
  Register a new user.  
  json
    {
      "username": "atharv",
      "email": "atharv@example.com",
      "password": "password123"
    }
    
 
    { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
    

- POST /api/auth/login
  Log in and get a JWT token.  
  - 
   
    {
      "email": "atharv@example.com",
      "password": "password123"
    }
   

    { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 


## Folder strucure 
book-review-api/
├── config/
│   └── db.js              
├── middleware/
│   └── auth.js          
├── models/
│   ├── user.js           
│   ├── book.js            
│   └── review.js          
├── routes/
│   ├── auth.js            
│   ├── books.js           
│   └── reviews.js         
├── .env                   
├── server.js              
├── package.json         
└── README.md             
```

##  Improvements

- Implemented rate limiting to prevent abuse.
- Add more advanced filtering and sorting options for books and reviews.
