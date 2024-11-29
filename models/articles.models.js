const db = require("../db/connection")

function fetchArticleIdData(id) {
    return db.query(`SELECT articles.*, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id `, [id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, message: "Invalid input"})
        }else {

            return rows
        }
    })
}

// 
function fetchArticleData(sort_by, order, topic) {
    const  queryValues = []
    const validSorts = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url", "comment_count"]
    const validOrders = ["ASC", "DESC"]
    
    if(!validSorts.includes(sort_by)) {
        return Promise.reject({status: 400, message: "Invalid sort_by"})
    }
    
    if(!validOrders.includes(order)) {
        return Promise.reject({status: 400, message: `unable to order by ${order}`})
    }
    
    
    
    let sqlQuery = `SELECT articles.article_id, articles.title, articles.author, articles.created_at, articles.topic, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `
    
    if(topic !== null) {
        sqlQuery += `WHERE articles.topic = $1`
        queryValues.push(topic)
    }

    sqlQuery += `GROUP BY articles.article_id `
    sqlQuery += `ORDER BY ${sort_by} ${order}`

    return db.query(sqlQuery, queryValues).then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 400, message: "No articles matching topic"})
        }
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

module.exports = {fetchArticleData, fetchArticleIdData, updateArticle}