const {findCommentsByArticleId, addComment, removeComment} = require('../models/comments.models')

exports.getCommentsByArticleId = (req, res, next) => {
  const {article_id} = req.params;

  findCommentsByArticleId(article_id).then(comments => {
    res.status(200).send({comments})
  }).catch(next)
}

exports.postComment = (req, res, next) => {

  const {article_id} = req.params
  const newComment  = req.body

  addComment(article_id, newComment).then((comment) => {
      res.status(201).send({ comment })
  }).catch(next)
}

exports.deleteComment = (req, res, next) => {

  const { comment_id } = req.params
  
  removeComment(comment_id).then(() => {res.status(204).send()
  }).catch(next)
}