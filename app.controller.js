const endpoints = require("./endpoints.json")

function getApi(req, res) {
    res.status(200).send({endpoints})   
}

module.exports = {getApi}