require('dotenv').config();
const express = require('express');
const path = require('path');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { graphqlHTTP } = require('express-graphql');
const databaseConnection = require('./model/database/db');

const schemaArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

const schema = makeExecutableSchema({
   typeDefs: schemaArray,
   resolvers: resolversArray,
});

const port = process.env.PORT || 3000;
const app = express();

const customlMiddleware = function (req, res, next) {
   console.log('from(-- middleware');
   next();
};

app.use('/graphql', customlMiddleware, (req, res) => {
   graphqlHTTP({
      schema: schema,
      graphiql: true,
   })(req, res);
});

app.get('/', (req, res, next) => {
   res.send(`<h1>Let's start our story with graphql...</h1>`);
});

databaseConnection(() => {
   app.listen(port, () => {
      console.log(`server running on port ${port}...`);
   });
});
