module.exports = {
    production: false,
    origin: 'http://localhost:3000',
    cookieKey: '',
    secret: '',
    mongo: {
      uri: process.env.MONGODB_URI,
      host: process.env.MONGO_HOST,
      database: process.env.MONGO_DATABASE,
    },
    PORT: process.env.PORT || 4000,
  };