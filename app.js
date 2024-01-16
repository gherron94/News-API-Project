const express = require('express');
const {customErrors, psqlErrors, serverErrors} = require('./errors')
const {getTopics} = require('./controllers/topics.controllers')
const {getApis} = require('./controllers/api.controllers')
const {getArticleById, getArticles} = require('./controllers/articles.controllers')
const { getCommentsByArticleId } = require('./controllers/comments.controller')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getApis)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.use(customErrors);
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app;