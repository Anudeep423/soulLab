const express = require("express");
const app = express()
const mongoose = require("mongoose")
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRoutes = require("./views/user")


// middlewares

app.use(bodyParser());
app.use(cookieParser());
app.use("/api", userRoutes)

// connection to mongodb

mongoose
    .connect(process.env.MONGODB_URI || process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log("DB CONNECTED");
    });

// Port to run server on

const port = 8080;

// testing 

app.get("/", (req, res) => {
    return res.send("App is working fine")
})

// making server listen on a port 

app.listen(port, () => { console.log("Port started running") })
