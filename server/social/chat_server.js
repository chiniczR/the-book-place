const server = require('http').createServer()
const io = require('socket.io')(server)
// const mongo = require('mongodb').MongoClient
const Post = require('../database/models/post')
const Room = require('../database/models/room')
var cors = require('cors');


const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/the-book-place"; 
const options = {
    keepAlive: false,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

mongoose.connect(mongoURI, options);

mongoose.connection.on('connected', ()=>{  
    console.log('Mongoose default connection open to ' + mongoURI);
});

// If the connection throws an error
mongoose.connection.on('error', (err)=>{  
    console.log('handle mongo errored connections: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', ()=>{  
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', ()=>{
    mongoose.connection.close(()=>{
        console.log('App terminated, closing mongo connections');
        process.exit(0);
    });
});

io.on('connection', function (client) {
  // Listen on initial data request
  client.on("initial_data", () => {
    console.log('Going to look for posts through socket.io')
    Post.find({}, function(err, posts) {
      if (err) {
        console.log(err)
      }
      else {
        posts.sort(function(a,b){ return b.createdDate - a.createdDate })
        // console.log(JSON.stringify(posts))
        io.sockets.emit("get_data", posts);
      }
    })
  })
  client.on("putPost", order => {
    Post.create(order,  function(err, post) {
      if (err) {
        console.log(err)
      }
      else {
        // console.log(JSON.stringify(posts))
        console.log('Created new post')
        Post.find({}, function(err, posts) {
          if (err) {
            console.log(err)
          }
          else {
            posts.sort(function(a,b){ return b.createdDate - a.createdDate })
            // console.log(JSON.stringify(posts))
            io.sockets.emit("get_data", posts);
          }
        })
      }
    })
  });
  client.on("voteOnPost", p => {
    console.log('On VOTE ON POST <-----------')
    console.log('VOTE ON POST ------ Got p:\n' + JSON.stringify(p))
    Post.find({ _id : p.postId }, function(err, post) {
      if (err) {
        console.log(err)
      }
      else if (post) {
        
        console.log('Post has positive votes from: ' + p.votedPos)
        console.log('Post has negative votes from: ' + p.votedNeg)
        console.log(p.voter + ' voted on post with ID=' + p.postId)
        var votedPos = p.votedPos
        var votedNeg = p.votedNeg
        if (p.vote === 1) {
          if (votedNeg.includes(p.voter)) {
            votedNeg.splice(votedNeg.indexOf(p.voter), 1)
          }
          votedPos.push(p.voter)
        }
        else if (p.vote === -1) {
          if (votedPos.includes(p.voter)) {
            votedPos.splice(votedPos.indexOf(p.voter), 1)
          }
          votedNeg.push(p.voter)
        }
        Post.updateOne({ _id : p.postId }, { likes: p.likes + p.vote, votedPos: votedPos, votedNeg: votedNeg },
          {upsert: true}, function(err, posts) {
            if (err) {
              console.log(err)
            }
            else {
              Post.find({}, function(err, posts) {
                if (err) {
                  console.log(err)
                }
                else {
                  posts.sort(function(a,b){ return b.createdDate - a.createdDate })
                  // console.log(JSON.stringify(posts))
                  io.sockets.emit("get_data", posts);
                }
              })
            }
        })
      }
    })
  });
  // Listen on new_message
  client.on('new_message', (data) => {
    // Broadcast the new message
    console.log('---> New message: ' + JSON.stringify(data))
    io.sockets.emit('new_message', {message : data.message, username : data.username, time: new Date()});
  })
  // Listen on typing
  client.on('typing', (data) => {
    console.log(JSON.stringify(data) + ' --- is typing')
    client.broadcast.emit('typing', {username : data.username})
  })
})

server.listen(5000, function (err) {
  if (err) throw err
  console.log('Chat Server listening on PORT: 5000')
})