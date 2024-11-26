const endpoints = require("./endpoints.json")
const {getTopicData, getArticleIdData} = require("./models/app.models")

function getApi(req, res) {
    res.status(200).send({endpoints})   
}

function getTopics(req, res) {
    getTopicData().then((topics) => {
        res.status(200).send({topics})
    })

}

function getArticleId(req, res, next) {
    const {article_id} = req.params
    getArticleIdData(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })

}

function psqlErrorHandler(err, req, res, next) {
    if(err.code === "22P02"){
        res.status(400).send({message: 'Invalid Id'})
    }
    else {
        next(err)
    }
}

function customErrorHandler(err, req, res, next)  {
    if(err.status && err.message) {
        res.status(err.status).send({message: err.message})
    }
    else {
        next(err)
    }
}

function serverErrorHandler(err, req, res, next)  {
    console.log(err, "in server error handler")
    res.status(500).send({msg: "Internal Server error"})
}



module.exports = {getApi, getTopics, getArticleId, serverErrorHandler, psqlErrorHandler, customErrorHandler}