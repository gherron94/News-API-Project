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

describe('api/articles/:article_id', () => {
  test('GET 200: returns an article object by article ID', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200).then(({body})=> {
      const article = body.article 
  
      expect(typeof article ).toBe('object')
      expect(Array.isArray(article)).toBe(false)

        expect(article).toHaveProperty('author')
        expect(article).toHaveProperty('title')
        expect(article).toHaveProperty('article_id')
        expect(article).toHaveProperty('body')
        expect(article).toHaveProperty('topic')
        expect(article).toHaveProperty('created_at')  
        expect(article).toHaveProperty('votes')
        expect(article).toHaveProperty('article_img_url')  
    })
  })
  test('GET 404: returns a 404 error for an article that does not exist', () => {
    return request(app)
    .get('/api/articles/999')
    .expect(404).then(({body})=>{
      expect(body.msg).toBe('Article does not exist')
    })
  })
  test('GET 400: returns a 400 error for an invalid article ID', () => {
    return request(app)
    .get('/api/articles/nonsenseID')
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
})

describe('api/articles', () => {
  test('GET 200: returns an array of all articles', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      const articlesArray = body.articles;

      expect(Array.isArray(articlesArray)).toBe(true)

      articlesArray.forEach(article => {
        expect(article).toHaveProperty('author')
        expect(article).toHaveProperty('title')
        expect(article).toHaveProperty('article_id')
        expect(article).toHaveProperty('topic')
        expect(article).toHaveProperty('created_at')  
        expect(article).toHaveProperty('votes')
        expect(article).toHaveProperty('article_img_url')
        expect(article).toHaveProperty('comment_count')
        expect(typeof article.comment_count).toBe('number')
        expect(article).not.toHaveProperty('body')
      })
    })
  })
  test('GET 200: array is sorted by date in descendng order by default', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({body}) => {
      const articlesArray = body.articles;
      expect(articlesArray).toBeSortedBy('created_at', {descending: true})
    })
  })
  test('GET 404: returns a 404 error for a route that does not exist', () => {
    return request(app)
    .get('/api/notarticles')
    .expect(404)
  })
})

describe('api/articles/:article_id/comments', () => {
  test('GET 200: returns an array of comments by article ID', () => {
    return request(app)
    .get(`/api/articles/9/comments`)
    .expect(200).then(({body})=> {
      const commentArray = body.comments

      expect(Array.isArray(commentArray)).toBe(true) 

      commentArray.forEach(comment => {
        expect(comment).toHaveProperty('comment_id')
        expect(comment).toHaveProperty('article_id')
        expect(comment).toHaveProperty('body')
        expect(comment).toHaveProperty('created_at')
        expect(comment).toHaveProperty('author')
        expect(comment).toHaveProperty('votes')
      })

      expect(commentArray).toBeSortedBy('created_at', {descending: false})
    })
  })
  test('GET 404: returns a 404 error for an article id that does not exist', () => {
    return request(app)
    .get('/api/articles/999/comments')
    .expect(404).then(({body})=>{
      expect(body.msg).toBe('Article does not exist')
    })
  })
  test('GET 400: returns a 400 error for an invalid article ID', () => {
    return request(app)
    .get('/api/articles/isnotavalidid/comments')
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('POST 201: adds a new comment', () => {
    const newComment = {
     username: 'icellusedkars',
     body: 'I found this article very interesting!'
    };
    const articleID = 1;

    return request(app)
      .post(`/api/articles/${articleID}/comments`)
      .send(newComment)
      .expect(201)
      .then(({body}) => {
        const responseComment = body.comment
  
        expect(responseComment.author).toBe(newComment.username)
        expect(responseComment.body).toBe(newComment.body)
        expect(responseComment.article_id).toBe(articleID)
        expect(responseComment.votes).toBe(0)

        expect(responseComment).toHaveProperty('created_at')
        expect(responseComment).toHaveProperty('comment_id')
      })
  })
  test('POST 400: returns a 400 error for an empty post object', () => {
    return request(app)
    .post('/api/articles/1/comments')
    .send({})
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('POST 400: returns a 400 error for an invalid post object', () => {
    return request(app)
    .post('/api/articles/1/comments')
    .send({
      username: 'Invalid username',
      body: 'Valid Body'
    })
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })


})