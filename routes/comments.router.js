const commentRouter = require('express').Router();
const { deleteComment, patchCommentById } = require('../controllers/comments.controller')

commentRouter
  .route('/:comment_id')
  .delete(deleteComment)
  .patch(patchCommentById)


  module.exports = commentRouter