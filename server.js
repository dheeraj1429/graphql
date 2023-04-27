require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

const typeDefsAr = loadFilesSync(path.join(__dirname, '**/*.graphql'));

const schema = makeExecutableSchema({
   typeDefs: typeDefsAr,
});

const root = {
   products: require('./graphql/products/products.model'),
   orders: require('./graphql/orders/orders.model'),
};

app.use(
   '/graphql',
   graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
   })
);

app.listen(port, () => {
   console.log(`server running on port ${port}...`);
});
