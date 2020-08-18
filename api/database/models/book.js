const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define bookSchema
const bookSchema = new Schema({

	title: { type: String, unique: false, required: true },
	isbn: { type: String, unique: false, required: true },
  author: { type: String, unique: false, required: true },
  tags: { type: Array, unique: false, required: true },
  numOfPages: { type: Number, unique: false, required: true },
  yearPublished: { type: Number, unique: false, required: true },
  publisher: { type: String, unique: false, required: true },
  language: { type: String, unique: false, required: true },
	cover: { type: String, unique: false, required: true, default: 'default.png' },
	price: { type: Number, unique: false, required: true }

})

const Book = mongoose.model('Book', bookSchema)
module.exports = Book
