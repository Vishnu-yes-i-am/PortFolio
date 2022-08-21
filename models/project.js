const { default: mongoose } = require('mongoose')
const Str = require('@supercharge/strings');
const mongo = require('mongoose')
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}
const ProjectSchema = new mongo.Schema({
    title: String,
    category: String,
    date: { type: String, default: (new Date).getUTCDate() + "-" + (new Date).getUTCMonth() + "-" + (new Date).getUTCFullYear() },
    link: String,
    image: { type: Array, default: ["https://dummyimage.com/medrect"] },
    desc: String,
    usedTech: [String]
})
module.exports = mongoose.model('Project', ProjectSchema)