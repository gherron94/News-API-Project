const {findArticleById, findArticles, updateArticle} = require('../models/articles.models')
const {checkTopicExists} = require('../check-exists')

exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params
  findArticleById(article_id).then((article) => {
    res.status(200).send({article}) 
  }).catch(next)
}

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query
  const findArticlesQuery =  findArticles(sort_by, order,  topic) ;

  const queries = [findArticlesQuery]

  if (topic) { 
    const checkTopicExistence = checkTopicExists(topic)
    queries.push(checkTopicExistence)
  }

  Promise.all(queries)
  .then((response) => {
    const articles = response[0]
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
 