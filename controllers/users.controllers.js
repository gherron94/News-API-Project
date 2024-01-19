const { findUsers, findUserByUsername } = require('../models/users.models')

exports.getUsers = (req, res, next) => {
  findUsers().then((users) => {
    res.status(200).send({users})
  }).catch(next)
}  

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params

  findUserByUsername(username).then((user) => {

console.log(user) 
   res.status(200).send({user})
  }).catch(next)
}  