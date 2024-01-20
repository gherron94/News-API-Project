const { findTopics, addTopic } = require('../models/topics.models')

exports.getTopics = (req, res, next) => {
  findTopics().then((topics) => {
    res.status(200).send({topics})
  })
} 

exports.postTopic = (req, res, next) => {

  const newTopic  = req.body
  addTopic(newTopic).then((topic) => {
      res.status(201).send({ topic })
  }).catch(next)
}