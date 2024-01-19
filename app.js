const express = require('express');

const {customErrors, psqlErrors, serverErrors} = require('./errors')

const apiRouter = require('./routes/api-router')

const app = express()

app.use(express.json())

app.use('/api', apiRouter);

app.use(customErrors);
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app;