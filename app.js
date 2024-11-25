const express = require("express");
const app = express();
app.use(express.json());
const {getApi, getTopics, customServer} = require("./app.controller");
const { customErrorHandler } = require("./app.controller");

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.all("/*", (req, res) => {
    res.status(404).send({message: `Route not found`})
})

module.exports = app;