const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define bookSchema
const joinRequestSchema = new Schema({

    requester: { type: mongoose.Mixed, unique: false, required: true },
    groupId: { type: String, unique: false, required: true },
    requestDate: { type: Date, unique: false, required: true }

})

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema)
module.exports = JoinRequest