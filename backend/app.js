//https://whales-app.firebaseio.com/market.json


//https://api.coinmarketcap.com/v1/ticker/?limit=250


var rp = require("request-promise")
var firebase = require("firebase");
let portfolio = {};
let market = {};

const environment = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyBoQQj5O2r5akeSCifTApT8KGeLZGxVVJA',
        authDomain: 'whalesapp-dev.firebaseapp.com',
        databaseURL: 'https://whalesapp-dev.firebaseio.com',
        projectId: 'whalesapp-dev',
        storageBucket: 'whales-app.appspot.com',
        messagingSenderId: '506504177003'
    }
};

firebase.initializeApp(environment.firebase);


var CronJob = require('cron').CronJob;
new CronJob('0 41 * * * *', function() {
    getMarketData();
}, null, true, 'Europe/Amsterdam');


function getMarketData() {
rp('https://whales-app.firebaseio.com/market.json')
    .then(portfolioString => {
        portfolio = JSON.parse(portfolioString);
        return rp('https://api.coinmarketcap.com/v1/ticker/?limit=250');
    }).then(marketString => {
        market = JSON.parse(marketString);

        for (let object of market) {
            const index3 = portfolio.findIndex(p => p.symbol === object.symbol);
            object['price_usd'] = +object['price_usd'];
            if (index3 >= 0) { object['balance'] = portfolio[index3].balance; object['value'] = portfolio[index3].balance * object['price_usd']; } else { object['balance'] = 0; }
            if (index3 >= 0) { object['inportfolio'] = portfolio[index3].inportfolio; } else { object['inportfolio'] = false; }
            object['volume_24h'] = object['24h_volume_usd'];
            object['volume_24h'] = +object['volume_24h'];
            object['last_updated'] = +object['last_updated'];
            object['market_cap_usd'] = +object['market_cap_usd'];
            object['price_btc'] = +object['price_btc'];
            object['price_usd'] = +object['price_usd'];
            object['percent_change_1h'] = +object['percent_change_1h'];
            object['percent_change_24h'] = +object['percent_change_24h'];
            object['percent_change_7d'] = +object['percent_change_7d'];
            object['available_supply'] = +object['available_supply'];
            object['total_supply'] = +object['total_supply'];
            object['last_updated'] = +object['last_updated'];
            delete object['24h_volume_usd'];
        }
        let updates = {};


        var database = firebase.database();
        const timestamp = firebase.database.ServerValue.TIMESTAMP;
        for (let object of market) {
            const key = firebase.database().ref().child('Tickers').push().key;
            const path = '/Tickers/' + object['symbol'] + '/' + key;
            updates[path] = { symbol: object['symbol'], price_usd: object['price_usd'], balance: object['balance'], time: timestamp };
        }
        firebase.database().ref().update(updates).then(results => {
            console.log('results', results);
        }).catch(err => {
            console.log('err', err);
        })
    })
}