const db = require ('../db/connection')

exports.findUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({rows}) => {
    return rows
  })
} 

exports.findUserByUsername = (username) => {
  return db.query(`SELECT * FROM users
  WHERE username = $1;`, [username]).then(({rows}) => {
      if (!rows[0]) {
        return Promise.reject({
          status:404,
          msg: 'Username does not exist'
        })
      }
    return rows[0]
  })
} 