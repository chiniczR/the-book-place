# The Book Place

This repository contains the code for a MERN (Mongo, Express, React, Node.js) web application called "The Book Place", that was developed for the course "Software Engineering for the Internet", of the Jerusalem College of Technology.

The application represents an online book shop and social network. Passport.js was used for authentication, Socket.IO for the blogging and real-time chat parts of the website, and Formidable (middleware) assisted in client-to-server file uploads.

***Containerization of the app is still in progress - The images are still being testing***

## Installation

>*As of the latest version, the app requires **MongoDB** to be running on the host, on port 27017*

1. API Server

* NPM
```
cd api
npm install
npm run start
```

2. Blog/Chat Server

* NPM
```
cd social
npm install
npm run chat
```

3. Client

* NPM
```
cd client
npm install
npm run start
```