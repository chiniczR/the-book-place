const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define messageSchema
const roomSchema = new Schema({

	name: { type: String, unique: true, required: true },
	admin: { type: String, unique: false, required: true },
	members: { type: Array, unique: false, required: true },
	groupPhoto: { type: String, unique: false, required: true }

})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room