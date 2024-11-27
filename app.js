const express = require("express");
const app = express();
app.use(express.json());
const {getApi, psqlErrorHandler, serverErrorHandler, customErrorHandler} = require("./controllers/app.controller");
const {getTopics,} = require("./controllers/topics.controller")
const { getArticleId, getArticles, } = require("./controllers/articles.controller")
const {getArticleComments, postComment} = require("./controllers/comments.controller")

app.get("/api", getApi)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleId)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.post("/api/articles/:article_id/comments", postComment)


app.all("/*", (req, res) => {
    res.status(404).send({message: `Route not found`})
})

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;