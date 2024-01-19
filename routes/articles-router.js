const articleRouter = require('express').Router();
const {getArticleById, getArticles, patchArticle, getCommentsByArticleId, postComment} = require('../controllers/articles.controllers')

articleRouter
  .route('/')
  .get(getArticles)

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment)

  module.exports = articleRouter