const { promises } = require("supertest/lib/test")
const db = require("../db/connection")



function getTopicData() {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

function getArticleIdData(id) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, message: "Invalid input"})
        }
        return rows
    })
    
}

module.exports = {getTopicData, getArticleIdData}