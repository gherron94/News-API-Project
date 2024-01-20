const articleRouter = require('express').Router();
const {getArticleById, getArticles, patchArticle, getCommentsByArticleId, postComment, postArticle, deleteArticle} = require('../controllers/articles.controllers')

articleRouter
  .route('/')
  .get(getArticles)
  .post(postArticle)

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle)

articleRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment)

  module.exports = articleRouter