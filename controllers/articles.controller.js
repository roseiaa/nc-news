const endpoints = require("../endpoints.json")
const {getArticleData, getArticleIdData} = require("../models/articles.models")

function getArticleId(req, res, next) {
    const {article_id} = req.params
    getArticleIdData(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })

}

function getArticles(req, res, next) {
    getArticleData().then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getArticles, getArticleId}
