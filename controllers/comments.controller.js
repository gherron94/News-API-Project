const {findCommentsByArticleId, addComment} = require('../models/comments.models')

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
