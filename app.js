//jshint esversion:6

require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.set("view engine", "ejs");

// app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static("public"));


//connect to mongoDB 
run()

async function run() {
    try {
        await mongoose.connect("mongodb://localhost:27017/userDB");
    } catch (error) {
        console.log(error.stack);
    }
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    
    newUser.save((error) => {
        if (error) {
            res.send(error)
        } else {
            res.render("secrets");
        }
    });
});


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (error, foundUser) => {
        if (error) {
            console.log(error);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    res.render("wrong password");
                }
            } else {
                res.render("User doesn't exist");
            }
        }
    });
});



//localhost server

let port = 3000;

app.listen(port, function(){
    console.log("Server up and running on port 3000")
});