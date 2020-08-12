# The Book Place

This repository contains the code for a MERN (Mongo, Express, React, Node.js) web application called "The Book Place", that was developed for the course "Software Engineering for the Internet", of the Jerusalem College of Technology.

The application represents an online book shop and social network. Passport.js was used for authentication, Socket.IO for the blogging and real-time chat parts of the website, and Formidable (middleware) assisted in client-to-server file uploads.

## Installation

### Docker

1. Compose
  Open the repository's root directory in a terminal and call:
```
docker-compose up
```

2. Address

  Once you see the following output,
```
client_1  | ℹ ｢wds｣: Project is running at http://*ip-address*/
client_1  | ℹ ｢wds｣: webpack output is served from 
client_1  | ℹ ｢wds｣: Content not from webpack is served from /app/public
client_1  | ℹ ｢wds｣: 404s will fallback to /
client_1  | Starting the development server...
```
  you can go to http://*ip-address*:3000

3. Check the containers' ID and status (optional)
```
docker container ls
```

### NPM

>*The NPM installation requires a **MongoDB** to be running on the host, on port 27017*

1. Setting local MongoDB
  1. Open */api/database/index.js* and change line 6:
```
const uri = 'mongodb://**mongo**:27017/the-book-place'
```
  to
```
const uri = 'mongodb://**localhost**:27017/the-book-place'
```
  2. Save, and then open */social/chat-server.js* and, once more, change line 9:
```
const uri = 'mongodb://**mongo**:27017/the-book-place'
```
  to
```
const uri = 'mongodb://**localhost**:27017/the-book-place'
```

2. API Server
```
cd api
npm install
npm run start
```

3. Blog/Chat Server
```
cd social
npm install
npm run chat
```

4. Client
```
cd client
npm install
npm run start
```

5. Go to *http://localhost:3000*

## Initial Data Import

Initial data is provided as .json files, to be imported into the Mongo database, either through the Compass GUI application, or through the mongo CLI, by doing the following:

### Docker
```
cd data
// For each *collection*.json file in this directory, after the containters are running:
docker cp *collection*.json mongo:/tmp/*collection*.json
docker exec mongo mongoimport -d the-book-place -c *collection* --file /tmp/*collection*.json
```

### NPM
```
cd data
// For each *collection*.json file in this directory:
mongoimport --db=the-book-place --collection=*collection* --file=*collection*.json
```
