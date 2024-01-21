# Northcoders News API

Northcoders News API is an API which progmatically accesses the data in a database.

The following endpoints are currently available on this API:

```
GET /api

GET /api/topics
POST /api/topics

GET /api/users
GET /ap/users/:username

GET /api/articles
POST /api/articles

GET /api/articles/:article_id
PATCH /api/articles/:article_id
DELETE /api/articles/:article_id

GET /api/articles/:article_id/comments
POST /api/articles/:article_id/comments
PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

```

Here is a link to the hosted version:
https://news-api-so0z.onrender.com

## Installation

This project can be cloned to your local machine using the command `git clone` followed by the code provided on gitHub.

Once opened in your code editor, use `npm install` to install the npm packages in the package.json file.

You will then need to setup and seed the database by running `npm run setup-dbs` followed by `npm run seed-prod` in your command line.

To run any tests simply execute 'npm test' in the command line or append the file name to run specfific tests.

## dotenv files

To seed the database correctly we will need to add the following dotenv files which have been hidden.

.env.test file which contains the test database enviroment e.g. `PGDATABASE=database_name`.

.env.development which contains the development database environment e.g. `PGDATABASE=database_name_test`.

## Minimum versions

To run this project locally your machine will need a minimum of the following versions of node.js and postgres:

- node.js - v20.8.1
- postgres - v8.7.3
