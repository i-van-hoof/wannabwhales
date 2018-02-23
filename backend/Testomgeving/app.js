//https://whales-app.firebaseio.com/market.json
//https://api.coinmarketcap.com/v1/ticker/?limit=250

// Once you have created a Firebase console project and downloaded a JSON file with your service account credentials, you can initialize the SDK with this code snippet:
// var serviceAccount = require('path/to/serviceAccountKey.json');

var admin = require('firebase-admin');
var rp = require("request-promise");

// The Admin SDKs can alternatively be authenticated with a different credential type.
// if running your code within Google Cloud Platform,
// make use of Google Application Default Credentials
// to have the Admin SDKs themselves fetch a service account on your behalf:

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://whalesapp-test-mr2.firebaseio.com/',
  databaseAuthVariableOverride: {
    uid: 'wbw-service-worker'
  }
});

let portfolio = [];
let count = 0;
let tickerData;
let tickers = [];
// let market = {};
let marketSummary = {};
let tickers2 = [];


// existing code for initializing Firebase SDK
// const environment = {
//     production: false,
//     firebase: {
//         apiKey: 'AIzaSyBoQQj5O2r5akeSCifTApT8KGeLZGxVVJA',
//         authDomain: 'whalesapp-dev.firebaseapp.com',
//         databaseURL: 'https://whalesapp-dev.firebaseio.com',
//         projectId: 'whalesapp-dev',
//         storageBucket: 'whales-app.appspot.com',
//         messagingSenderId: '506504177003'
//     }};
// firebase.initializeApp(environment.firebase);

// cronjob for saving market summary
var CronJob = require('cron').CronJob;

const cron1 = new CronJob('0 0,15,30,45 * * * *', function() {
  generateTickers();
  // generatePortfolioTickers();
  // console.log('working1');
}, null, true, 'Europe/Amsterdam');

const cron2 = new CronJob('0 0,15,30,45 * * * *', function() {
  getMarketSummary();
}, null, true, 'Europe/Amsterdam');

//  getting the market summary data from the Coinmarketcap API
function getMarketSummary() {
  console.log("Getting market summary data");
  rp('https://api.coinmarketcap.com/v1/global/')
    .then(globalString => {
    marketSummary = JSON.parse(globalString);

    // prepare an json object with market summary for Firebase
  console.log('generating json object market summary');
  var db = admin.database();
  const key = db.ref().child('MarketSummary').push().key;
  console.log(key);
  const path = '/MarketSummary/CoinMarketCap/' + key;
  console.log(path);
  let updates = {};

  // code voor timestamp met firebase als niet inloggen met admin rights
  // const timestamp = firebase.database.ServerValue.TIMESTAMP;
  const timestamp = admin.database.ServerValue.TIMESTAMP;
  updates[path] = {
    symbol: 'MARKETSUM',
    total_market_cap_usd: marketSummary['total_market_cap_usd'],
    total_24h_volume_usd: marketSummary['total_24h_volume_usd'],
    bitcoin_percentage_of_market_cap: marketSummary['bitcoin_percentage_of_market_cap'],
    active_currencies: marketSummary['active_currencies'],
    active_assets: marketSummary['active_assets'],
    active_markets: marketSummary['active_markets'],
    time: timestamp };
  // console.log(updates);
  db.ref().update(updates).then(results => {
    // console.log('results', results);
    console.log("Sent market summary from Coinmarket cap to Firebase");
}).catch(err => {
    console.log('err', err);
})
})
}

// this is NEW CODE not yet tested in App Engine

function generateTickers() {
   return rp('https://api.coinmarketcap.com/v1/ticker/?limit=325').then(tickerString => {
    tickers = JSON.parse(tickerString);
    for (let object of tickers) {
      object['volume_24h'] = +object['24h_volume_usd'];
      delete object['24h_volume_usd'];
      object['market_cap_usd'] = +object['market_cap_usd'];
      object['price_btc'] = +object['price_btc'];
      object['price_usd'] = +object['price_usd'];
      delete object['percent_change_1h'];
      delete object['percent_change_24h'];
      delete object['percent_change_7d'];
      delete object['available_supply'];
      delete object['total_supply'];
      delete object['last_updated'];
    }
    console.log("Parsed "+tickers.length+" coin tickers");
    generatePortfolioTickers(tickers);
    let tickerUpdates = {};

    var db = admin.database();

    for (let object of tickers) {
      const key = db.ref().child('Tickers').push().key;
      const timestamp = admin.database.ServerValue.TIMESTAMP;
      const tickersPath = '/Tickers/' + object['symbol'] + '/' + key;
      tickerUpdates[tickersPath] = {
        symbol: object['symbol'],
        rank: object['rank'],
        price_usd: object['price_usd'],
        price_btc: object['price_btc'],
        market_cap_usd: object['market_cap_usd'],
        time: timestamp};
    }

  // update Firebase with market tickers, once every 15 minutes
    db.ref().update(tickerUpdates).then(results => {
    // console.log('results', results);
    console.log("Send "+tickers.length+" records to firebase v2114");
    //after finishing saving the tickers run the portfolio tickers function for saving the tickers of individual users
    }).catch(err => {
    console.log('err', err);
    })

})
}

function generatePortfolioTickers(tickers2) {
  var total = 0;
  var db = admin.database();
  return db.ref('UserPortfolios/V0uICQbXrnfCryghTkRpmbv4sBn2').once('value')
    .then(snapshot => {
      portfolio = snapshot.val();
      console.log("finding out if tickers is succesfullt imported in generatePortfolioTickers");
      console.log(tickers2);
      console.log("using tickerdata in function generatePortoflioTickers");
      // console.log(tickers);
      // console.log(portfolio);
      // return rp('https://api.coinmarketcap.com/v1/ticker/?limit=275');}).then(marketString => {
      //  market = JSON.parse(marketString);
  count = 0;
      for (let object of portfolio) {
        count = count + 1;
        const index = tickers2.findIndex(p => p.symbol === object.symbol);
        if (index >= 0) {object['price_usd'] = tickers2[index].price_usd; object['value'] = object.balance * object.price_usd; total += object['value'] }
        else { console.log(count); console.log(object.symbol); object['value'] = object.balance * object.price_usd; total += object['value']};
    }}).catch(results => {
      console.log("generatePortfolioTickers function is not working properly");
      console.log('error:', results);})
    };
  // let updates = {};

  // // var database = firebase.database();
  // var db = admin.database();
  //
  // // const timestamp = firebase.database.ServerValue.TIMESTAMP;
  // const timestamp = admin.database.ServerValue.TIMESTAMP;
  // for (let object of market) {
  //   const key = db.ref().child('Tickers').push().key;
  //   const path = '/Tickers/' + object['symbol'] + '/' + key;
  //   updates[path] = { symbol: object['symbol'], price_usd: object['price_usd'], balance: object['balance'], time: timestamp };
  // }

  // prepare an json object with portfolio ticker for Firebase
  // console.log('generating portfolioTickers');
  // const key2 = db.ref().child('Tickers').push().key;
  // const path2 = '/PortfolioTickers/V0uICQbXrnfCryghTkRpmbv4sBn2/' + key2;
  // let updates2 = {};
  //
  // updates2[path2] = { symbol: 'PORTF1', price_usd: total, balance: 1, time: timestamp };
  // console.log(updates2);

// update firebase with portfolio ticker, once every hour
//   db.ref().update(updates2).then(results => {
//     // console.log('results', results);
//     console.log("Send "+market.length+" records to firebase");
// }).catch(err => {
//     console.log('err', err);
// })

//   // OLD CODE update Firebase with market tickers TO BE DELETED
//   db.ref().update(updates).then(results => {
//     // console.log('results', results);
//     console.log("Send "+market.length+" records to firebase");
// }).catch(err => {
//     console.log('err', err);
// })



