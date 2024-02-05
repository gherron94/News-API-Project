const express = require('express');
const cors = require('cors');

const {customErrors, psqlErrors, serverErrors} = require('./errors')

const apiRouter = require('./routes/api-router')

const app = express()

app.use(cors());
app.use(express.json())

app.use('/api', apiRouter);

app.use(customErrors);
app.use(psqlErrors)
app.use(serverErrors)

module.exports = app;