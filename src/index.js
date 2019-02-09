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
    addStock(
      "代號"
      symbol: String,
      "公司"
      company: String,
      "股價"
      price: Float,
      "殖利率"
      dividend: Float,
      "(4季)每股稅後淨利(EPS)(元)"
      epsOf4Seasons: Float,
      "(年)每股稅後淨利(EPS)(元)"
      epsOfLastYear: Float,
      "(年-1)每股稅後淨利(EPS)(元)"
      epsOf2YearsAgo: Float,
      "(年-2)每股稅後淨利(EPS)(元)"
      epsOf3YearsAgo: Float,
      "(月)營收年增率(%)"
      yoyOfLastMonth: Float,
      "(月-1)營收年增率(%)"
      yoyOf2MonthAgo: Float,
      "(月-2)營收年增率(%)"
      yoyOf3MonthAgo: Float,
      "(月)累積營收年增率(%)"
      accumulatedYoyOfLastMonth: Float,
      "(4季)營業利益率(%)"
      opmOf4Seasons: Float,
      "(年)營業利益率(%)"
      opmOfLastYear: Float,
      "(年-1)營業利益率(%)"
      opmOf2YearsAgo: Float,
      "(年-2)營業利益率(%)"
      opmOf3YearsAgo: Float,
      "(4季)稅後淨利率(%)"
      npmOf4Seasons: Float,
      "(年)稅後淨利率(%)"
      npmOfLastYear: Float,
      "(年-1)稅後淨利率(%)"
      npmOf2YearsAgo: Float,
      "(年-2)稅後淨利率(%)"
      npmOf3YearsAgo: Float,
      "(季)期末現金及約當現金(百萬)"
      casheOfLastSeason: Float,
      "(季)速動比率(%)"
      quickRatioOfLastSeason: Float,
    ): Stock
  }

  type Stock {
    "代號"
    symbol: String,
    "公司"
    company: String,
    "股價"
    price: Float,
    "殖利率"
    dividend: Float,
    "(4季)每股稅後淨利(EPS)(元)"
    epsOf4Seasons: Float,
    "(年)每股稅後淨利(EPS)(元)"
    epsOfLastYear: Float,
    "(年-1)每股稅後淨利(EPS)(元)"
    epsOf2YearsAgo: Float,
    "(年-2)每股稅後淨利(EPS)(元)"
    epsOf3YearsAgo: Float,
    "(月)營收年增率(%)"
    yoyOfLastMonth: Float,
    "(月-1)營收年增率(%)"
    yoyOf2MonthAgo: Float,
    "(月-2)營收年增率(%)"
    yoyOf3MonthAgo: Float,
    "(月)累積營收年增率(%)"
    accumulatedYoyOfLastMonth: Float,
    "(4季)營業利益率(%)"
    opmOf4Seasons: Float,
    "(年)營業利益率(%)"
    opmOfLastYear: Float,
    "(年-1)營業利益率(%)"
    opmOf2YearsAgo: Float,
    "(年-2)營業利益率(%)"
    opmOf3YearsAgo: Float,
    "(4季)稅後淨利率(%)"
    npmOf4Seasons: Float,
    "(年)稅後淨利率(%)"
    npmOfLastYear: Float,
    "(年-1)稅後淨利率(%)"
    npmOf2YearsAgo: Float,
    "(年-2)稅後淨利率(%)"
    npmOf3YearsAgo: Float,
    "(季)期末現金及約當現金(百萬)"
    casheOfLastSeason: Float,
    "(季)速動比率(%)"
    quickRatioOfLastSeason: Float,
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
      // 新增 stock
      const result = await new Promise((resolve, reject) => {
        models.stocks.create(args, function (err, data) {
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