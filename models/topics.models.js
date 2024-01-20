const db = require ('../db/connection')

exports.findTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({rows}) => {
    return rows
  })
}

exports.addTopic = (newTopic) => {

  const { slug, description } = newTopic

  return db.query(`
  INSERT INTO topics 
  (slug, description)
  VALUES
  ($1, $2)
  RETURNING *;
  `, [slug, description]).then(({rows}) => {
    const topic = rows[0]
      return topic
  })
}