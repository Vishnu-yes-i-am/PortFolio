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

const port = process.env.PORT || 5000;
app.listen(port);
console.log("is listening at ", port);
