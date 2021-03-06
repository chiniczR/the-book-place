//Connect to Mongo database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

//27017 is the default mongoDB port
const uri = 'mongodb://mongo:27017/the-book-place' 

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }).then(
    () => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log('Connected to Mongo');

    },
    err => {
         /** handle initial connection error */
         console.log('error connecting to Mongo: ')
         console.log(err);

        }
  );


module.exports = mongoose.connection
