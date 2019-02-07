module.exports = {
    production: false,
    origin: 'http://localhost:3000',
    mongoURI: `mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_DATABASE}`,
    cookieKey: '',
    secret: '',
    mongo: {
      host: process.env.MONGO_HOST,
      database: process.env.MONGO_DATABASE,
    },
    PORT: process.env.PORT || 4000,
  };