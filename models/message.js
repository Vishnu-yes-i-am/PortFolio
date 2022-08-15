const { default: mongoose } = require('mongoose')
const Str = require('@supercharge/strings');
const mongo = require('mongoose')

const MessageSchema = new mongo.Schema({
    name: String,
    email: { type: String, unique: true },
    count: { type: Number, default: 1 },
    messages: [{ title: String, body: String }]
})
module.exports = mongoose.model('Message', MessageSchema)