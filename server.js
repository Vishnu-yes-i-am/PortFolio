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
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
            console.log(results);
        }
    }
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

const port = process.env.PORT || 5000;
app.listen(port);
console.log("is listening at ", port);
