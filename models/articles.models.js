const db = require('../db/connection')

exports.findArticleById = (article_id) => {

  return db.query(`SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles 
  LEFT JOIN comments  
  ON (articles.article_id = comments.article_id) 
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`,[article_id]).then(({rows})=> {
    const article = rows[0]
    if (!article) {
      return Promise.reject({ 
        status: 404,
        msg: 'Article does not exist'
      })
    }
    return article
  })
}

exports.findArticles = (sort_by = 'created_at', order = 'desc', topic) => {

  const validSortQueries = ['author', 'title', 'comment_count', 'created_at', 'votes', 'article_image_url, topic']

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({status: 400, msg: 'Invalid sort query'})
  }

  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({status: 400, msg: 'Invalid order query'})
  }

  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON (articles.article_id = comments.article_id)`

  const queryParams = [];

  if (topic) {
    queryStr+= ` WHERE topic = $1`;
    queryParams.push(topic);
  }

  queryStr+= ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order}
  ;`

  return db.query(
  queryStr, queryParams).then(({rows}) => {
    return rows
  })

}
 
exports.updateArticle = (updatedvoteCount, article_id) => {

  const { inc_votes } = updatedvoteCount

  return db.query(`
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `, [inc_votes, article_id]).then(({rows}) => {
    if (!rows[0]) {
      return Promise.reject({
        status: 404,
        msg: 'Invalid article Id'
      })
    }


    return rows[0]
  })
}

exports.findCommentsByArticleId = (article_id) => {

  return db.query(`SELECT 
  * FROM comments 
  WHERE article_id = $1
  ORDER BY created_at ASC`, [article_id]).then(({rows}) => {
    const comment = rows
  
    if (!comment.length) {
      return db.query(`SELECT * FROM articles where article_id = $1`, [article_id]).then(({rows}) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: 'Article does not exist'
          })
        } else {
          return comment
        }
      })
    }
  
  return comment
})
}

exports.addComment = (article_id, newComment) => {

  const { body, username } = newComment

  return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]).then(({rows}) => {

    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Article does not exist'
      })
    } 

  return db.query(`
  INSERT INTO comments 
  (body, article_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING *;
  `, [body, article_id, username]).then(({rows}) => {
    const comment = rows[0]
      return comment
  })

})
}

