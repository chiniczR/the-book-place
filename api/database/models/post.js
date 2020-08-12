const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// Define messageSchema
const postSchema = new Schema({

    poster: { type: String, unique: false, required: true },
	content: { type: String, unique: false, required: true },
	sharedWith: { type: String, unique: false, required: true, default: 'All' },
	likes: { type: Number, unique: false, required: true, default: 1 },
	votedPos: { type: Array, unique: false, required: true, default: function() {
		var arr = []
		arr.push(this.poster)
		return arr
	} },
	votedNeg: { type: Array, unique: false, required: true, default: [] },
	createdDate: { type: Date, unique: false, required: false, default: new Date() }

})

const Post = mongoose.model('Post', postSchema)
module.exports = Post