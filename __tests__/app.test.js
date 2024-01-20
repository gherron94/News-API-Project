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

        expect(article.title).toBe('Living in the shadow of a great man')
        expect(article.author).toBe('butter_bridge')
        expect(article.body).toBe('I find this existence challenging')
        expect(article.article_id).toBe(1)
        
    })
  })
  test('GET 200: returns an article object by article ID with comment_count of all comments', () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200).then(({body})=> {
      const article = body.article 

      expect(article).toHaveProperty('comment_count')
      expect(article.comment_count).toBe(11)
   
    })
  })
  test('GET 200: returns an article object by article ID with comment_count of all comments when there are no comments', () => {
    return request(app)
    .get('/api/articles/2')
    .expect(200).then(({body})=> {
      const article = body.article 

      expect(article).toHaveProperty('comment_count')
      expect(article.comment_count).toBe(0)
   
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
  test('PATCH 200: updates article votes by id', () => {
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
        expect(typeof patchedArticle.created_at).toBe('string')
        expect(patchedArticle.title).toBe('Living in the shadow of a great man')
        expect(patchedArticle.author).toBe('butter_bridge')
        expect(patchedArticle.topic).toBe('mitch')
        expect(typeof patchedArticle.article_img_url).toBe('string')
        expect(typeof patchedArticle.body).toBe('string')
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
      const responseArticlesArray = body.articles;
      const totalArrayLength = body.total_count

      expect(totalArrayLength).toBe(12)

      responseArticlesArray.forEach(article => {
        expect(article.topic).toBe('mitch')
      })

      expect(responseArticlesArray).toBeSortedBy('created_at', {descending: true})
    })
  })
  test('GET 200: responds with an empty array when passed an valid topic query with no articles', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({body}) => {
   
        expect(body.articles).toEqual([]);
      })
  })
  test('GET 200: array is sorted by the sort_by query ', () => {
    return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({body}) => {
        const articlesArray = body.articles;

        expect(articlesArray).toBeSortedBy('author', {
          descending: true
        })
      })
  })
  test('GET 200: array is sorted by the default sort_by query of created_at in ascending order ', () => {
    return request(app)
    .get('/api/articles?order=asc')
    .expect(200)
    .then(({body}) => {
      const articlesArray = body.articles;
      expect(articlesArray).toBeSortedBy('created_at', {descending: false})
    })
  })
  test('GET 200: array is filtered by page', () => {
    return request(app)
    .get('/api/articles?p=2')
    .expect(200)
    .then(({body}) => {
      const articlesPageArray = body.articles;
      const totalArticlesArrayLength = body.total_count;
  
      expect(totalArticlesArrayLength).toBe(13)
      expect(articlesPageArray.length).toBe(3)
    })
  })
  test('GET 200: array is filtered by limit', () => {
    return request(app)
    .get('/api/articles?limit=5')
    .expect(200)
    .then(({body}) => {
      const articleArray = body.articles;
      const totalArticlesArrayLength = body.total_count;
  
      expect(totalArticlesArrayLength).toBe(13)
      expect(articleArray.length).toBe(5)
    })
  })
  test('GET 400: returns an error for an invalid limit query ', () => {
    return request(app)
      .get('/api/articles?limit=invalid')
      .expect(400)
      .then(({body}) => {
  
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('GET 400: returns an error for an invalid page query ', () => {
    return request(app)
      .get('/api/articles?p=invalid')
      .expect(400)
      .then(({body}) => {
  
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('GET 400: returns an error for an invalid sort_by query ', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid')
      .expect(400)
      .then(({body}) => {
  
        expect(body.msg).toBe('Invalid sort query')
      })
  })
  test('GET 400: returns an error for an invalid order query ', () => {
    return request(app)
      .get('/api/articles?order=invalid')
      .expect(400)
      .then(({body}) => {
  
        expect(body.msg).toBe('Invalid order query')
      })
  })
  test('GET 404: responds with an error message when passed an invalid topic query', () => {
    return request(app)
      .get('/api/articles?topic=notavalidtopic')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Topic does not exist')
      })
  })
  test('GET 404: returns a 404 error for a route that does not exist', () => {
    return request(app)
    .get('/api/notarticles')
    .expect(404)
  })
  test('POST 201: adds a new article', () => {
    const newArticle = {
     author: 'icellusedkars',
     title: 'Posting a new article',
     body: 'This is a test for posting a new article',
     topic: 'mitch',
    }

    return request(app)
      .post(`/api/articles`)
      .send(newArticle)
      .expect(201)
      .then(({body}) => {
        const reponseArticle = body.article
  
        expect(reponseArticle.author).toBe(newArticle.author)
        expect(reponseArticle.body).toBe(newArticle.body)
        expect(reponseArticle.topic).toBe(newArticle.topic)
        expect(reponseArticle.votes).toBe(0)
        expect(typeof reponseArticle.created_at).toBe('string')
        expect(typeof reponseArticle.article_img_url).toBe('string')
        expect(typeof reponseArticle.article_id).toBe('number')
        expect(reponseArticle.comment_count).toBe(0)
      })
  })
  test('POST 400: returns a 400 error for an empty post object', () => {
    return request(app)
    .post('/api/articles')
    .send({})
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('POST 400: returns a 400 error for an invalid post object', () => {
    return request(app)
    .post('/api/articles')
    .send({
      author: 1,
      title: 39,
      body: 'This is a test for posting an invalid new article',
      topic: 'none',
     })
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
})

describe('api/articles/:article_id/comments', () => {
  test('GET 200: returns an array of comments by article ID', () => {
    return request(app)
    .get(`/api/articles/1/comments`)
    .expect(200).then(({body})=> {
      const commentArray = body.comments
      const totalCommentsArrayLength = body.total_count

      expect(totalCommentsArrayLength).toBe(11)

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
  test('GET 200: returns an empty array for an article with no comments', () => {
    return request(app)
    .get(`/api/articles/2/comments`)
    .expect(200).then(({body})=> {
      const commentArray = body.comments

      expect(commentArray).toEqual([])
    })
  })
  test('GET 200: comment array is filtered by page', () => {
    return request(app)
    .get('/api/articles/1/comments?p=2')
    .expect(200)
    .then(({body}) => {
      const returnedCommentsArray = body.comments;
      const totalCommentsLength = body.total_count;
  
      expect(totalCommentsLength).toBe(11)
      expect(returnedCommentsArray.length).toBe(1)
    })
  })
  test('GET 200: array is filtered by limit', () => {
    return request(app)
    .get('/api/articles/1/comments?limit=5')
    .expect(200)
    .then(({body}) => {
      const returnedCommentsArray = body.comments;
      const totalCommentsLength = body.total_count;
  
      expect(totalCommentsLength).toBe(11)
      expect(returnedCommentsArray.length).toBe(5)
    })
  })
  test('GET 400: returns an error for an invalid limit query ', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=invalid')
      .expect(400)
      .then(({body}) => {
  
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('GET 400: returns an error for an invalid page query ', () => {
    return request(app)
      .get('/api/articles/3/comments?p=invalid')
      .expect(400)
      .then(({body}) => {
  
        expect(body.msg).toBe('Bad Request')
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
  test('POST 404: returns a 404 error for an article id that does not exist', () => {
    const newComment = {
      username: 'icellusedkars',
      body: 'I found this article very interesting!'
     };
    return request(app)
    .post('/api/articles/999/comments')
    .send(newComment)
    .expect(404).then(({body})=>{
      expect(body.msg).toBe('Article does not exist')
    })
  })
  test('POST 400: returns a 400 error for an invalid article ID', () => {
    const newComment = {
      username: 'icellusedkars',
      body: 'I found this article very interesting!'
     };
    return request(app)
    .post('/api/articles/isnotavalidid/comments')
    .send(newComment)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })

})

describe('api/comments/:comment_id', () => {
  test('DELETE 204: removes comment by id', ()=> {
    return request(app)
    .delete(`/api/comments/1`)
    .expect(204) 
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
  test('PATCH 200: updates comment votes by id', () => {
    const voteUpdate = {
      inc_votes: + 10
    };
    return request(app)
      .patch('/api/comments/1')
      .send(voteUpdate)
      .expect(200)
      .then(({body}) => {
        const patchedComment = body.comment

        expect(patchedComment.votes).toBe(26)
        expect(typeof patchedComment.created_at).toBe('string')
        expect(patchedComment.article_id).toBe(9)
        expect(patchedComment.author).toBe('butter_bridge')
        expect(typeof patchedComment.body).toBe('string')
      })
  })
  test('PATCH 400: returns a 400 error for an empty patch object', () => {
    return request(app)
    .patch('/api/comments/1/')
    .send({})
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('PATCH 400: returns a 400 error for an invalid patch object', () => {
    return request(app)
    .patch('/api/comments/2')
    .send({
      inc_votes: 'Strings are not valid here'
    })
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe('Bad Request')
    })
  })
  test('PATCH 400: returns a 400 error for a valid patch object invalid comment Id', () => {
      return request(app)
      .patch('/api/comments/nonsense')
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
    .patch('/api/comments/12222/')
    .send({
      inc_votes: 20
    })
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe('Comment does not exist')
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
  
      expect(responseUsersArray.length).toBe(4)

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

describe('api/users/:username', () => {
  test('GET 200: returns a user object by username', () => {
    return request(app)
    .get('/api/users/lurker')
    .expect(200)
    .then(({body}) => {
      const userObject = body.user;

        expect(userObject.username).toBe('lurker')
        expect(userObject.name).toBe('do_nothing')
        expect(typeof userObject.avatar_url).toBe('string')
    })
  })
  test('GET 404: returns a 404 error for username that does not exist', () => {
    return request(app)
    .get('/api/users/doesnotexist')
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe('Username does not exist')
    })
  })
}) 

