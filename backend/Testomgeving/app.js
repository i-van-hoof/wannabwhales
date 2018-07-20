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

let users = [];
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

const cron3 = new CronJob('0 1,11,21,31,41,51 * * * *', function() {
  saveMarketInfo();
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
  return db.ref().update(updates).then(function(results) {
    console.log('results', results);
    console.log("Sent market summary from Coinmarket cap to Firebase");
}).catch(err => {
    console.log('err', err);
})
})
}

// getting marketinfo and generate the tickers per coin for graphs and make the ticker of each UserPortfolio (generatePortfolioTickers())

function generateTickers() {
   return rp('https://api.coinmarketcap.com/v1/ticker/?limit=400').then(tickerString => {
    tickers = JSON.parse(tickerString);
    for (let object of tickers) {
      object['volume_24h'] = +object['24h_volume_usd'];
      delete object['24h_volume_usd'];
      // new code for replacing special characters
      object['symbol'] = object['symbol'].replace(/[^a-zA-Z ]/g, '');

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
    console.log("Parsed "+tickers.length+" market-tickers");

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
    console.log("Send "+tickers.length+" market-tickers to Firebase");
    //after finishing saving the tickers run the portfolio tickers function for saving the tickers of individual users
    }).catch(err => {
    console.log('err', err);
    })
})
}

function generatePortfolioTickers(tickers2) {
  var db = admin.database();
  db.ref('users').once('value')
    .then(userdata => {
    users = userdata.val();
  // console.log(users);
  let usersKeys = Object.keys(users);
  // console.log(usersKeys);

// get for each user from array usersKeys de portfolio
  for (let userKey of usersKeys) {
    // return db.ref('UserPortfolios/V0uICQbXrnfCryghTkRpmbv4sBn2').once('value')
    db.ref('UserPortfolios/' + userKey).once('value')
      .then(function(snapshot) {
        // console.log(userKey);
        portfolio = snapshot.val();
        console.log("users loop started using tickerdata in function generatePortoflioTickers");

// calculate the value of each portfolio item and total of portfolio
        var total = 0;
        var count = 0;
    for (let object of portfolio) {
      count = count + 1;
      // const index = tickers2.findIndex(p => p.symbol === object.symbol);
      const  index = tickers2.map(function(x) {return x.symbol; }).indexOf(object.symbol);
      if (index >= 0) {
        object['price_usd'] = tickers2[index].price_usd;
        // console.log(object['price_usd']);
        // console.log(object['balance']);
        object['value'] = object['balance'] * object['price_usd'];
        total += object['value'];
        // console.log(total);
      }
      else {
        // console.log(count);
        // console.log(object.symbol);
        // object['value'] = object.balance * object.price_usd;
        // total += object['value']
      }
    }
        console.log("first users loop complete");

    const timestamp = admin.database.ServerValue.TIMESTAMP;
        console.log('generating portfolioTickers');
    const key2 = db.ref().child('Tickers').push().key;
    // const path2 = '/PortfolioTickers/V0uICQbXrnfCryghTkRpmbv4sBn2/' + key2;
    const path2 = '/PortfolioTickers/' + userKey + '/' + key2;
    let updates2 = {};
    updates2[path2] = {symbol: 'PORTF1', price_usd: total, balance: 1, time: timestamp};
    // console.log(updates2);

// update Firebase with portfolio ticker
    db.ref().update(updates2).then(function(results) {
      console.log('results', results);
    console.log("Send " + usersKeys.length + " portfolio Tickers to firebase");
  }).catch(function(err) {
      console.log('err', err);
  })
// new line of code
  }).catch(function(results) {
    console.log("generatePortfolioTickers function is not working properly");
    console.log('error:', results);
  });
}
})};

// this is NEW CODE for saving market info in Firebase database each 10 minutes
function saveMarketInfo() {
  for (i = 0; i < 17; i++) {

  let start = i * 100;
  console.log(start);
  rp('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=' + start + '&limit=100').then(marketString => {
    market = JSON.parse(marketString);
    let marketInfo = {};
    keyList = Object.keys(market['data']);

    for (let item of keyList) {
      symbol = market['data'][item]['symbol'].replace(/[^a-zA-Z ]/g, '');

      marketInfo[symbol] = {
        id: market['data'][item].id,
        name: market['data'][item].name,
        symbol: market['data'][item].symbol,
        website_slug: market['data'][item].website_slug,
        rank: market['data'][item].rank,
        circulating_supply: market['data'][item].circulating_supply,
        total_supply: market['data'][item].total_supply,
        price_usd: market['data'][item]['quotes']['USD'].price,
        price_btc: market['data'][item]['quotes']['BTC'].price,
        volume_24h: market['data'][item]['quotes']['USD'].volume_24h,
        market_cap: market['data'][item]['quotes']['USD'].market_cap,
        percent_change_1h: market['data'][item]['quotes']['USD'].percent_change_1h,
        percent_change_24h: market['data'][item]['quotes']['USD'].percent_change_24h,
        percent_change_7d: market['data'][item]['quotes']['USD'].percent_change_7d,
        last_updated: market['data'][item].last_updated
      }
    }
    // console.log(marketInfo)

  // update Firebase with market tickers, once every 15 minutes
    var db = admin.database();
    db.ref('market').update(marketInfo).then(results => {
    console.log('storing data in Firebase market folder worked');
    //after finishing saving the tickers run the portfolio tickers function for saving the tickers of individual users
    }).catch(err => {
    console.log('error:', err);
    })

    // let test = {};
    // Object.keys(market['data']).map(e => {
    //     test[market['data'][e]['symbol']] = market['data'][e];
    // });
    // console.log(test);

    // var db = admin.database();

     // update Firebase with market quotes, once every .. minutes
    // db.ref().child('market').update(market).then(results => {
    //   console.log("Send " +market.length+" market-quotes to Firebase");
    // }).catch(err => {
    //   console.log('err', err);
    //   })
  })
}
}




