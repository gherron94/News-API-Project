const { findApis } = require('../models/api.models')

exports.getApis = (req, res, next) => {
  findApis().then((apis) => {
    res.status(200).send({apis})
  })
} 