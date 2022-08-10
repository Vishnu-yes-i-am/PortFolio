const { default: mongoose } = require('mongoose')
const Str = require('@supercharge/strings');
const mongo = require('mongoose')

const ProjectSchema = new mongo.Schema({
    title: String,
    category: String,
    data: Date,
    link: String,
    images: [{ String }],
    desc: String,
    usedTech: [String]
})
module.exports = mongoose.model('Project', ProjectSchema)