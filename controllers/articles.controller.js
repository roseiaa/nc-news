const endpoints = require("../endpoints.json")
const {fetchArticleData, fetchArticleIdData, updateArticle, insertArticle} = require("../models/articles.models")

function getArticleId(req, res, next) {
    const {article_id} = req.params
    fetchArticleIdData(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })

}

function getArticles(req, res, next) {
    const {sort_by = "created_at", order = "DESC", topic = null} = req.query
    fetchArticleData(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

function patchArticle(req, res, next) {
    const newVote = req.body.inc_votes
    const {article_id} = req.params
    updateArticle(newVote, article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

function postArticle(req, res, next) {
    const body = req.body
    insertArticle(body).then((article) => {
        res.status(201).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getArticles, getArticleId, patchArticle, postArticle}
