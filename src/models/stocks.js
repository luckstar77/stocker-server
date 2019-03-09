//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var DividendSchema = new Schema({ 
    date: String ,
    dividend: Number,
    priceOfLastDay: Number,
    openingPrice: Number,
    yield: Number,
    per: Number,
    pbr: Number,
    success: Boolean,
    successDay: Number,
});

var ModelSchema = new Schema({
    symbol: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'The price is need greater than 0.'],
    },
    dividend: {
        type: Number,
        min: [0, 'The dividend is need greater than or equal to 0.'],
    },
    dividendAvg: {
        type: Number,
        min: [0, 'The dividend is need greater than or equal to 0.'],
    },
    epsOf4Seasons: {
        type: Number,
    },
    epsOfLastYear: {
        type: Number,
    },
    epsOf2YearsAgo: {
        type: Number,
    },
    epsOf3YearsAgo: {
        type: Number,
    },
    yoyOfLastMonth: {
        type: Number,
    },
    yoyOf2MonthAgo: {
        type: Number,
    },
    yoyOf3MonthAgo: {
        type: Number,
    },
    accumulatedYoyOfLastMonth: {
        type: Number,
    },
    opmOf4Seasons: {
        type: Number,
    },
    opmOfLastYear: {
        type: Number,
    },
    opmOf2YearsAgo: {
        type: Number,
    },
    opmOf3YearsAgo: {
        type: Number,
    },
    npmOf4Seasons: {
        type: Number,
    },
    npmOfLastYear: {
        type: Number,
    },
    npmOf2YearsAgo: {
        type: Number,
    },
    npmOf3YearsAgo: {
        type: Number,
    },
    casheOfLastSeason: {
        type: Number,
    },
    quickRatioOfLastSeason: {
        type: Number,
    },
    dividendCount: {
        type: Number,
        min: [0, 'The dividendCount is need greater than or equal to 0.'],
    },
    dividendSuccessCount: {
        type: Number,
        min: [0, 'The dividendSuccessCount is need greater than or equal to 0.'],
    },
    dividendSuccessPercent: {
        type: Number,
        min: [0, 'The dividendSuccessPercent is need greater than or equal to 0.'],
    },
    dividends: [DividendSchema],
});

// Compile model from schema
module.exports = mongoose.model('StockModel', ModelSchema );