const express = require('express');
const {getTopics} = require('./controllers/topics.controllers')
const {getApis} = require('./controllers/api.controllers')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getApis)


module.exports = app;