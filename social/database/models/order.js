const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise

// var CounterSchema = Schema({
//     _id: {type: String, required: true},
//     seq: { type: Number, default: 0 }
// });
// var counter = mongoose.model('counter', CounterSchema)

// Define orderSchema
const orderSchema = new Schema({
    clientId: { type: String, unique: false, required: true },
    books: { type: Array, unique: false, required: true },
    total: { type: Number, unique: false, required: true },
    creationDate: { type: Date, unique: false, required: true, default: Date.now() },
    status: { type: String, enum: [ 'placed', 'en route', 'delivered', 'canceled' ], required: true, default: 'placed' }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order