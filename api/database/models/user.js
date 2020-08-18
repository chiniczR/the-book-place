const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define userSchema
const userSchema = new Schema({

	username: { type: String, unique: true, required: true },
	password: { type: String, unique: false, required: true },
	passSalt: { type: String, unique: false, required: true },
	firstName: { type: String, unique: false, required: true },
	lastName: { type: String, unique: false, required: true },
	role: { type: String, unique: false, required: true },
	cardNum: { type: String, unique: false, required: ( this.role == "client" ) },
	address: { type: String, unique: false, required: ( this.role == "client" || this.role == "supplier" ) },
	email: { type: String, unique: true, required: true },
	profilePic: { type: String, unique: false, required: false },
	online: { type: Boolean, unique: false, required: false },
	statusPhrase: { type: String, unique: false, required: false },
	reset_password_token: {
        type: String
      },
      reset_password_expires: {
        type: Date
      }
})

// Define schema methods
userSchema.methods = {
	checkPassword: function (inputPassword) {
		return inputPassword ===  this.password
	}
}

const User = mongoose.model('User', userSchema)
module.exports = User
