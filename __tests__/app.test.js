const request = require('supertest');
const app = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

const apiEndpointsFile = require('../endpoints.json')
const testData = require('../db/data/test-data')

afterAll(() => {
  return db.end()
})

beforeEach(() => {
  return seed(testData)
})

describe('api/topics', () => {
  test('GET 200: returns an array of all topics', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body}) => {
      const topicsArray = body.topics;

      expect(Array.isArray(topicsArray)).toBe(true)

      topicsArray.forEach(topic => {
        expect(topic).toHaveProperty('description')
        expect(topic).toHaveProperty('slug')
      })
    })
  })
  test('GET 404: returns a 404 error for a route that does not exist', () => {
    return request(app)
    .get('/api/nonsense')
    .expect(404)
  })
})

describe('api/', () => {
  test('GET 200: returns a JSON object of all APIs', () => {
    return request(app)
    .get('/api')
    .expect(200).then(({body})=> {
      const apisObject = body.apis

      expect(typeof apisObject).toBe('object')
      expect(Array.isArray(apisObject)).toBe(false)
      expect(apiEndpointsFile).toEqual(apisObject)
    })
  })
  test('GET 404: returns a 404 error for a route that does not exist', () => {
    return request(app)
    .get('/abc')
    .expect(404)
  })
})