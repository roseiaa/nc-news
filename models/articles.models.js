const db = require("../db/connection")

function getArticleIdData(id) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, message: "Invalid input"})
        }
        return rows
    })
}

function getArticleData() {
    return db.query(`SELECT articles.*, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles`).then(({rows}) => {
        rows.forEach((article) => {
            article.comment_count = Number(article.comment_count)
            delete article.body
        })
        return rows
    })
}

function updateArticle(voteModifier, id) {
    if(!voteModifier || typeof voteModifier !== "number") {
        return Promise.reject({status: 400, message: "Invalid Request"})
    }
    const values = [voteModifier, id]
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2`, values)
    .then(() => {
        return db.query(`SELECT * FROM articles WHERE article_id = ${id}`)
        .then((data) => {
            if(data.rows.length === 0) {
                return Promise.reject({status: 404, message: "Invalid input"})
            }
            return data.rows
        })
    })

}

module.exports = {getArticleData, getArticleIdData, updateArticle}