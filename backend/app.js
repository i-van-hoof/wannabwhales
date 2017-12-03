//https://whales-app.firebaseio.com/market.json


//https://api.coinmarketcap.com/v1/ticker/?limit=250


var rp = require("request-promise")
var firebase = require("firebase");
let portfolio = {};
let market = {};
let marketSummary = {};

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
const cron1 = new CronJob('0 0 * * * *', function() {
    getMarketData();
}, null, true, 'Europe/Amsterdam');

// tweede cronjob for saving market summary
const cron2 = new CronJob('0 0,15,30,45 * * * *', function() {
  getMarketSummary();
}, null, true, 'Europe/Amsterdam');

// new function for getting the market summary form the CoinmarketCap API
function getMarketSummary() {
  console.log("Getting market summary data");
rp('https://api.coinmarketcap.com/v1/global/')
  .then(globalString => {
      marketSummary = JSON.parse(globalString);
      console.log(marketSummary);

  // NEW CODE prepare an json object with market summary for Firebase
  console.log('generating json object market summary');
  const key3 = firebase.database().ref().child('MarketSummary').push().key;
  console.log(key3);
  const path3 = '/MarketSummary/CoinMarketCap/' + key3;
  console.log(path3);
  let updates3 = {};
  const timestamp3 = firebase.database.ServerValue.TIMESTAMP;
  updates3[path3] = {
    symbol: 'MARKETSUM',
    total_market_cap_usd: marketSummary['total_market_cap_usd'],
    total_24h_volume_usd: marketSummary['total_24h_volume_usd'],
    bitcoin_percentage_of_market_cap: marketSummary['bitcoin_percentage_of_market_cap'],
    active_currencies: marketSummary['active_currencies'],
    active_assets: marketSummary['active_assets'],
    active_markets: marketSummary['active_markets'],
    time: timestamp3 };
  console.log(updates3);

  firebase.database().ref().update(updates3).then(results => {
    // console.log('results', results);
    console.log("Send summary records to firebase");
}).catch(err => {
    console.log('err', err);
})
});

}

function getMarketData() {
    var total = 0;
    console.log("Getting market data");
rp('https://whales-app.firebaseio.com/market.json')
    .then(portfolioString => {
        portfolio = JSON.parse(portfolioString);
        return rp('https://api.coinmarketcap.com/v1/ticker/?limit=275');
    }).then(marketString => {
        market = JSON.parse(marketString);

        for (let object of market) {
            const index3 = portfolio.findIndex(p => p.symbol === object.symbol);
            object['price_usd'] = +object['price_usd'];
            if (index3 >= 0) { object['balance'] = portfolio[index3].balance; object['value'] = portfolio[index3].balance * object['price_usd']; total += object['value'];} else { object['balance'] = 0; }
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
            object['total_supply'] = +object['total_supgcloudply'];
            object['last_updated'] = +object['last_updated'];
            delete object['24h_volume_usd'];
        }
        console.log("Parsed "+market.length+" records");
        let updates = {};
        console.log(total);


        var database = firebase.database();
        const timestamp = firebase.database.ServerValue.TIMESTAMP;
        for (let object of market) {
            const key = firebase.database().ref().child('Tickers').push().key;
            const path = '/Tickers/' + object['symbol'] + '/' + key;
            updates[path] = { symbol: object['symbol'], price_usd: object['price_usd'], balance: object['balance'], time: timestamp };
        }
        // prepare an json object with portfolio ticker for Firebase
        console.log('generating portfolioTickers');
        const key2 = firebase.database().ref().child('Tickers').push().key;
        console.log(key2);
        const path2 = '/PortfolioTickers/UserId/' + key2;
        console.log(path2);
        let updates2 = {};
        const timestamp2 = firebase.database.ServerValue.TIMESTAMP;
        updates2[path2] = { symbol: 'PORTF1', price_usd: total, balance: 1, time: timestamp2 };
        console.log(updates2);



// update firebase with portfolio ticker, once every hour
        firebase.database().ref().update(updates2).then(results => {
            // console.log('results', results);
            console.log("Send "+market.length+" records to firebase");
        }).catch(err => {
            console.log('err', err);
        })

  // update Firebase with market ticker, once every hour
        firebase.database().ref().update(updates).then(results => {
            // console.log('results', results);
            console.log("Send "+market.length+" records to firebase");
        }).catch(err => {
            console.log('err', err);
        })
    })
}
