const {findArticleById, findArticles, updateArticle} = require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params
  findArticleById(article_id).then((article) => {
    res.status(200).send({article}) 
  }).catch(next)
}
exports.getArticles = (req, res, next) => {
  const { topic } = req.query
  findArticles(topic).then((articles) => {
    res.status(200).send({articles}) 
  }).catch(next)
}

exports.patchArticle = (req, res, next) => {
  const  updatedvoteCount  = req.body
  const { article_id } = req.params

  updateArticle(updatedvoteCount, article_id).then((article) => {
    res.status(200).send( { article } )
  }).catch(next)
}
 