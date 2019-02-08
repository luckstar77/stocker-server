const connect = require('connect');
const { ApolloServer, gql } = require('apollo-server-express');
const query = require('qs-middleware');
const { PORT } = require('./config');
const mongo = require('./mongoose');
const models = require('./models');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    stocks: [Stock]
  }

  # Mutation 定義
  type Mutation {
    "新增股票"
    addStock(id: ID!, name: String!): Stock
  }

  type Stock {
    id: ID,
    name: String,
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    stocks: () => models.stocks.find(),
  },
  // Mutation Type Resolver
  Mutation : {
    addStock: async (root, args, context) => {
      const { id, name } = args;

      // 新增 stock
      const result = await new Promise((resolve, reject) => {
        models.stocks.create({ id, name }, function (err, data) {
          if (err) {
            reject(err);
            return;
          };
          resolve(data);
        });
      });

      return result;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = connect();
const path = '/graphql';

app.use(query());

server.applyMiddleware({ app, path });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);