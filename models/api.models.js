const db = require('../db/connection')
const fs = require('fs/promises')

exports.findApis = () => {
  return fs.readFile('./endpoints.json', 'utf-8').then((apiData)=> {
    const parsedApiData =  JSON.parse(apiData)
    return parsedApiData
  })
}