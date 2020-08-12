const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define messageSchema
const messageSchema = new Schema({

	name: { type: String, unique: false, required: true },
	email: { type: String, unique: false, required: true },
  subject: { type: String, unique: false, required: false },
  content: { type: String, unique: false, required: true },

})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message
