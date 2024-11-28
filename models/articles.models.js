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

// `SELECT articles.*, (SELECT COUNT(comments.comment_id) AS comment_count FROM articles WHERE comments.article_id = articles.article_id) AS comment_count FROM articles`
function getArticleData(sort_by, order) {
    let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id `
    sqlQuery += `ORDER BY ${sort_by} ${order}`
    

    return db.query(sqlQuery).then(({rows}) => {
        console.log(rows)
        rows.forEach((article) => {
            article.comment_count = Number(article.comment_count)
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