const express = require("express");
const app = express();
app.use(express.json());
const {getApi, getTopics, getArticleId, getArticleComments, psqlErrorHandler, serverErrorHandler, customErrorHandler, getArticles} = require("./app.controller");


app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleId)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticleComments)


app.all("/*", (req, res) => {
    res.status(404).send({message: `Route not found`})
})

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;