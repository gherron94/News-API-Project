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
  test('PATCH 200: updates article cost by id', () => {
    const voteUpdate = {
      inc_votes: - 10
    };
    return request(app)
      .patch('/api/articles/1')
      .send(voteUpdate)
      .expect(200)
      .then(({body}) => {
        const patchedArticle = body.article

        expect(patchedArticle.votes).toBe(90)
        expect(patchedArticle.title).toBe('Living in the shadow of a great man')
        expect(patchedArticle.author).toBe('butter_bridge')
      })
  })
  test('PATCH 400: returns a 400 error for an empty patch object', () => {
    return request(app)
    .patch('/api/articles/1/')
    .send({})
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('PATCH 400: returns a 400 error for an invalid patch object', () => {
    return request(app)
    .patch('/api/articles/2')
    .send({
      inc_votes: 'Strings are not valid here'
    })
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('PATCH 400: returns a 400 error for a valid patch object but article id that does not exist', () => {
      return request(app)
      .patch('/api/articles/nonsense')
      .send({
        inc_votes: 20
      })
      .expect(400)
      .then(({body})=>{
        expect(body.msg).toBe('Bad Request')
      })
    })
  test('PATCH 404: returns a 404 error for a valid patch object but an article id that doesnt exist', () => {
    return request(app)
    .patch('/api/articles/12222/')
    .send({
      inc_votes: 20
    })
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Invalid article Id')
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
  test('GET 200: array is filtered by topic query', () => {
    return request(app)
    .get('/api/articles?topic=mitch')
    .expect(200)
    .then(({body}) => {
      const articlesArray = body.articles;

      expect(articlesArray.length).toBe(4)

      articlesArray.forEach(article => {
        expect(article.topic).toBe('mitch')
      })

      expect(articlesArray).toBeSortedBy('created_at', {descending: true})
    })
  })

  test('GET 400: responds with an error message when passed an invalid topic query', () => {
    return request(app)
      .get('/api/articles?topic=notavalidtopic')
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid topic query')
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

describe('api/comments/:comment_id', () => {
  test('DELETE 204: removes comment by id', ()=> {
    const testCommentId = 1;

    return db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [testCommentId]).then(({rows}) => {
      const commentBeforeDeletion = rows;

      expect(commentBeforeDeletion.length).toBe(1)
      expect(commentBeforeDeletion[0].comment_id).toBe(testCommentId)

    return request(app)
    .delete(`/api/comments/${testCommentId}`)
    .expect(204) 
    .then(() => {

    return db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [testCommentId]).then(({rows}) => {
      const deletedComment = rows

      expect(deletedComment.length).toBe(0)
        })
      })
    })
  })
  test('DELETE 404: returns a 404 error for a comment ID that does not exist', () => {
    return request(app)
    .delete('/api/comments/1000')
    .expect(404).then(({body})=>{
      expect(body.msg).toBe('Comment does not exist')
    })
  })
  test('DELETE 400: returns a 400 error for an invalid coomment ID', () => {
    return request(app)
    .delete('/api/comments/fakeComment')
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
})

describe('api/users', () => {
  test('GET 200: returns an array of all users', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({body}) => {
      const responseUsersArray = body.users;
      const originalDataUsersArray = testData.userData

      expect(responseUsersArray).toEqual(originalDataUsersArray)

      responseUsersArray.forEach(user => {
        expect(user).toHaveProperty('username')
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('avatar_url')
      })
    })
  })
  test('GET 404: returns a 404 error for a route that does not exist', () => {
    return request(app)
    .get('/api/nonsenseRoute')
    .expect(404)
  })
})