const db = require("../db/connection")

function getTopicData() {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

module.exports = {getTopicData,}