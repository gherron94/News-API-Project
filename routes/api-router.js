const apiRouter = require('express').Router()

const {getApis} = require('../controllers/api.controllers')
const userRouter = require('./users-router');
const topicRouter = require('./topics-router')
const articleRouter = require('./articles-router')
const commentRouter = require('./comments.router')

apiRouter.get('/', getApis)
apiRouter.use('/users', userRouter);
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter)

module.exports = apiRouter