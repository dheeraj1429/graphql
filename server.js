require('dotenv').config();
const express = require('express');
const path = require('path');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const databaseConnection = require('./model/database/db');
const { ApolloServer } = require('apollo-server-express');
const port = process.env.PORT || 3000;

const schemaArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
const resolversArray = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

async function startApolloServer() {
   const app = express();

   const schema = makeExecutableSchema({
      typeDefs: schemaArray,
      resolvers: resolversArray,
   });

   const server = new ApolloServer({
      schema,
   });

   await server.start();
   server.applyMiddleware({ app, path: '/graphql' });

   app.get('/', (req, res, next) => {
      res.send(`<h1>Let's start our story with graphql...</h1>`);
   });

   databaseConnection(() => {
      app.listen(port, () => {
         console.log(`server running on port ${port}...`);
      });
   });
}

startApolloServer();
