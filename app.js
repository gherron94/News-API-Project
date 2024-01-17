const express = require('express');
const {customErrors, psqlErrors, serverErrors} = require('./errors')
const {getTopics} = require('./controllers/topics.controllers')
const {getApis} = require('./controllers/api.controllers')
const {getArticleById, getArticles, patchArticle} = require('./controllers/articles.controllers')
const { getCommentsByArticleId, postComment, deleteComment } = require('./controllers/comments.controller');
const { getUsers } = require('./controllers/users.controllers')
const { pipeline } = require('supertest/lib/test');

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getApis)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id',deleteComment)

app.use(customErrors);
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app;