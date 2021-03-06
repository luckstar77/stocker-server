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
    findByCD: [Stock]
    stock(search: String): [Stock]
  }

  # Mutation 定義
  type Mutation {
    "新增股票"
    upsertStock(
      "代號"
      symbol: String,
      "公司"
      company: String,
      "股價"
      price: Float,
      "殖利率"
      dividend: Float,
      "歷年平均殖利率"
      dividendAvg: Float,
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
      "填權息次數"
      dividendCount: Int,
      "填權息成功次數"
      dividendSuccessCount: Int,
      "填權息成功率"
      dividendSuccessPercent : Float,
      "填權息資料"
      dividends: [DividendInput],
    ): Stock
    removeStock(symbol: String!): Stock
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
    "歷年平均殖利率"
    dividendAvg: Float,
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
    "填權息次數"
    dividendCount: Int,
    "填權息成功次數"
    dividendSuccessCount: Int,
    "填權息成功率"
    dividendSuccessPercent : Float,
    "填權息資料"
    dividends: [Dividend],
  }

  type Dividend {
    "除權息日"
    date : String,
    "權息值"
    dividend: Float,
    "前一日收盤"
    priceOfLastDay: Float,
    "開盤參考價"
    openingPrice: Float,
    "殖利率"
    yield: Float,
    "本益比"
    per: Float,
    "股價淨值比"
    pbr: Float,
    "是否填權息"
    success: Boolean,
    "可填權息天數"
    successDay: Int,
  }

  input DividendInput {
    "除權息日"
    date : String,
    "權息值"
    dividend: Float,
    "前一日收盤"
    priceOfLastDay: Float,
    "開盤參考價"
    openingPrice: Float,
    "殖利率"
    yield: Float,
    "本益比"
    per: Float,
    "股價淨值比"
    pbr: Float,
    "是否填權息"
    success: Boolean,
    "可填權息天數"
    successDay: Int,
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    stocks: async () => await models.stocks.find({ symbol: { $ne: null } }),
    findByCD: async () => {
      let stocks = await models.stocks.find({ symbol: { $ne: null } });
      
      return stocks.filter(stock=>
          stock.accumulatedYoyOfLastMonth > 0
          && stock.epsOfLastYear > stock.epsOf2YearsAgo * 0.9
          && stock.epsOfLastYear > stock.epsOf3YearsAgo * 0.9
          ? true : false
        ).sort((a,b)=>b.dividend - a.dividend)
    },
    stock: async (root, {search}, context) => await models.stocks.find({ $or: [{symbol: {$regex : new RegExp(search)}},{company: {$regex : new RegExp(search)}}] }),
  },
  // Mutation Type Resolver
  Mutation : {
    upsertStock: async (root, args, context) => {
      const { symbol } = args;
      // 新增 stock
      const result = await new Promise((resolve, reject) => {
        models.stocks.updateOne({symbol}, args, {upsert: true}, function (err, data) {
          if (err) {
            reject(err);
            return;
          };
          resolve(data);
        });
      });

      return result;
    },
    removeStock: async(root, args, context) => {
      const { symbol } = args;
      // 新增 stock
      const result = await new Promise((resolve, reject) => {
        models.stocks.deleteOne(args, function (err, data) {
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

const options = {typeDefs, resolvers};
if(process.env.NODE_ENV === 'DEVELOPMENT') options = {...options, introspection: true, playground: true};
const server = new ApolloServer(options);

const app = connect();
const path = '/graphql';

app.use(query());

server.applyMiddleware({ app, path });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);