const db = require('../db/connection');

exports.findCommentsByArticleId = (article_id) => {
  return db.query(`SELECT 
  * FROM comments 
  WHERE article_id = $1
  ORDER BY created_at ASC`, [article_id]).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Article does not exist'
      })
    }
    return rows
  })

}

exports.addComment = (article_id, newComment) => {

  const { body, username } = newComment

  return db.query(`
  INSERT INTO comments 
  (body, article_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING *;
  `, [body, article_id, username]).then(({rows}) => {
   return rows[0]
  })
}




