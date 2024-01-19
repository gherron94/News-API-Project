const db = require('../db/connection');

exports.removeComment = (comment_id) => {

   return db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id]).then(({rows}) => {

    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Comment does not exist'
      })
    } 
  
    return db.query(`
    DELETE FROM comments WHERE comment_id = $1`, [comment_id])
  } )

}

exports.updateComment = (updatedvoteCount, comment_id) => {

  const { inc_votes } = updatedvoteCount

  return db.query(`
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *
  `, [inc_votes, comment_id]).then(({rows}) => {
    if (!rows[0]) {
      return Promise.reject({
        status: 404,
        msg: 'Comment does not exist'
      })
    }


    return rows[0]
  })
}