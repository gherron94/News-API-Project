
exports.customErrors = ((err, req, res, next) => {
  if (err.status && err.msg) {
   res.status(err.status).send({msg: err.msg})
  } else {
   next(err)
  }
 })
 
 exports.psqlErrors = ((err, req, res, next) => {
   if (err.code = '22P02') {
     res.status(400).send({msg:'Bad Request'})
   } else {
   next(err)
  }
  })

  exports.serverErrors = ((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Internal error Server'})
  })

