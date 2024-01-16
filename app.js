const express = require('express');
const {customErrors, psqlErrors, serverErrors} = require('./errors')
const {getTopics} = require('./controllers/topics.controllers')
const {getApis} = require('./controllers/api.controllers')
const {getArticleById, getArticles, patchArticle} = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postComment } = require('./controllers/comments.controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApis)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.use(customErrors);
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app;