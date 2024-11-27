const endpoints = require("../endpoints.json")
const {getTopicData} = require("../models/topics.models")

function getTopics(req, res) {
    getTopicData().then((topics) => {
        res.status(200).send({topics})
    })

}

module.exports = {getTopics}