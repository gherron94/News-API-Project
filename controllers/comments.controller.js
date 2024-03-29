const {removeComment, updateComment} = require('../models/comments.models')

exports.deleteComment = (req, res, next) => {

  const { comment_id } = req.params
  
  removeComment(comment_id).then(() => {res.status(204).send()
  }).catch(next)
}

exports.patchCommentById = (req, res, next) => {
  const  updatedvoteCount  = req.body
  const { comment_id } = req.params

  updateComment(updatedvoteCount, comment_id).then((comment) => {
    res.status(200).send( { comment } )
  }).catch(next)
}

