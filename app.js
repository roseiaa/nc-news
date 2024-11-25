const express = require("express");
const app = express();
app.use(express.json());
const {getApi} = require("./app.controller")

app.get("/api", getApi)


module.exports = app;