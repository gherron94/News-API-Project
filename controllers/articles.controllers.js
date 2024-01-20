const {findArticleById, findArticles, updateArticle, findCommentsByArticleId, addComment, addArticle} = require('../models/articles.models')
const {checkTopicExists} = require('../check-exists')

exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params
  findArticleById(article_id).then((article) => {
    res.status(200).send({article}) 
  }).catch(next)
}

exports.getArticles = (req, res, next) => {
  const { sort_by, order, limit, p, topic } = req.query
  const findArticlesQuery =  findArticles(sort_by, order, limit, p, topic) ;

  const queries = [findArticlesQuery]

  if (topic) { 
    const checkTopicExistence = checkTopicExists(topic)
    queries.push(checkTopicExistence)
  }

  Promise.all(queries)
  .then(([response]) => {
    const articles = response[0]
    const total_count = response[1]

    res.status(200).send({articles, total_count}) 
  }).catch(next)
}

exports.patchArticle = (req, res, next) => {
  const  updatedvoteCount  = req.body
  const { article_id } = req.params

  updateArticle(updatedvoteCount, article_id).then((article) => {
    res.status(200).send( { article } )
  }).catch(next)
}

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

exports.postArticle = (req, res, next) => {

  const newArticle  = req.body

  addArticle(newArticle).then((article) => {
      res.status(201).send({ article })
  }).catch(next)
}

