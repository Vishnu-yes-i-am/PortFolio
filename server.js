const express = require("express");
const app = express();
var path = require("path");
var session = require("express-session");
require("dotenv").config();
app.set("view engine", "ejs");
const mongo = require("mongoose");
const Str = require('@supercharge/strings')
const bodyParser = require('body-parser');
const project = require("./models/project");
const message = require("./models/message")
const validate = require('deep-email-validator');
const { json } = require("body-parser");

const validateEmail = async (email) => {
    const verdict = (await validate.validate(email)).valid
    if (verdict) {
        return true;
    }
    else return false;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SALT,
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 6000000,
        },
    })
);
// Connecting Database
mongo.connect(
    process.env.DB_URI,
    { usenewUrlParser: true }
);
const db = mongo.connection;
db.on("error", (error) => {
    console.error(error);
});
db.once("open", () => {
    console.log("connection complete");
});
console.log(__dirname);
app.use(express.static(path.join(__dirname, "views")))
app.get("/", async (req, res) => {
    const projects = await project.find({});
    res.render("index.ejs", { projects: projects });
});
app.get("/showProject", async (req, res) => {
    const id = req.query.id;
    const p = await project.find({ _id: id });
    if (p.length == 1) {
        res.render("projectDetails.ejs", { data: p[0] });
    }
    else {
        res.send("this project is not available");
    }
});

app.post("/contact/send_message", async (req, res) => {
    const email = req.body.email;
    if (!(await validateEmail(email)) || !email) {
        res.status(403).send("Enter a valid Email");
    }
    else {

        const result = await message.find({ email: email })
        if (result.length === 1) {
            if (result[0].count >= 5)
                res.status(403).send("Kido !! Don't  Spam");
            else {
                await message.findOneAndUpdate({ email: email }, { $inc: { count: 1 }, $push: { messages: { title: req.body.subject, body: req.body.message } } })
                res.status(200).redirect("/");
            }
        }
        else {
            newMessage = new message({ name: req.body.name, email: email, messages: [{ title: req.body.subject, body: req.body.message }] })
            await newMessage.save();
            res.status(200).redirect("/")
        }
    }
})
const port = process.env.PORT || 7992;
app.listen(port);
console.log("is listening at ", port);
