const endpoints = require("./endpoints.json")
const {getTopicData} = require("./models/app.models")

function getApi(req, res) {
    res.status(200).send({endpoints})   
}

function getTopics(req, res) {
    getTopicData().then((topics) => {
        res.status(200).send({topics})
    })

}



module.exports = {getApi, getTopics}