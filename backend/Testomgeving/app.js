var admin = require('firebase-admin');
var rp = require("request-promise");

// Once you have created a Firebase console project and downloaded a JSON file with your service account credentials, you can initialize the SDK with this code snippet:
// var serviceAccount = require('path/to/serviceAccountKey.json');
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
}, null, true, 'Europe/Amsterdam');

const cron2 = new CronJob('0 0,15,30,45 * * * *', function() {
  getMarketSummary();
}, null, true, 'Europe/Amsterdam');

const cron3 = new CronJob('0 1,11,21,31,41,51 * * * *', function() {
  saveMarketInfo();
}, null, true, 'Europe/Amsterdam');

const cron4 = new CronJob('0 5,15,25,35,45,55 * * * *', function() {
  saveMarketInfoNameAsKey();
}, null, true, 'Europe/Amsterdam');

// const cron5 = new CronJob('0 20,40,59 * * * *', function() {
//   getData();
// }, null, true, 'Europe/Amsterdam');

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

// NEW CODE for getting 1000 first coins from coinmarketcap
 function getData() {
var url1 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=0&limit=100';
var url2 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=100&limit=100';
var url3 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=200&limit=100';
var url4 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=300&limit=100';
var url5 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=400&limit=100';
var url6 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=500&limit=100';
var url7 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=600&limit=100';
var url8 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=700&limit=100';
var url9 = 'https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=800&limit=100';

rp(url1)
  .then(response => {
    market = JSON.parse(response)
    info1 = market.data
    return rp(url2)
  })
  .then(response => {
    market = JSON.parse(response)
    info2 = market.data
    return rp(url3)
  })
  .then(response => {
    market = JSON.parse(response)
    info3 = market.data
    return rp(url4)
  })
  .then(response => {
    market = JSON.parse(response)
    info4 = market.data
    return rp(url5)
  })
  .then(response => {
    market = JSON.parse(response)
    info5 = market.data
    return rp(url6)
  })
  .then(response => {
    market = JSON.parse(response)
    info6 = market.data
    return rp(url7)
  })
  .then(response => {
    market = JSON.parse(response)
    info7 = market.data
    return rp(url8)
  })
  .then(response => {
    market = JSON.parse(response)
    info8 = market.data
    return rp(url9)
  })
  .then(response => {
    market = JSON.parse(response)
    info9 = market.data
    const object2 = Object.assign(
      info1, info2, info3, info4, info5, info6, info7, info8, info9);
    keyList = Object.keys(object2)
    let marketInfo = {}
    for (let item of keyList) {
      symbol = object2[item]['name'].replace(/[^a-zA-Z0-9 ]/g, '');

      marketInfo[symbol] = {
        id: object2[item].id,
        name: object2[item].name,
        symbol: object2[item].symbol,
        price_usd: object2[item]['quotes']['USD'].price,
      }
    }
    console.log("function get 1000 first objects of coinmarketcap tickers works")
    generatePortfolioTickersNEW(marketInfo)
    // If something went wrong
    // throw new Error('messed up')
  })
  .catch(err => console.log) // Don't forget to catch errors
 }

// getting marketinfo and generate the tickers per coin for graphs and make the ticker of each UserPortfolio (generatePortfolioTickers())

function generateTickers() {
   return rp('https://api.coinmarketcap.com/v1/ticker/?limit=400').then(tickerString => {
    tickers = JSON.parse(tickerString);
    for (let object of tickers) {
      object['volume_24h'] = +object['24h_volume_usd'];
      delete object['24h_volume_usd'];
      // replacing special characters, because limitations database
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
    // console.log("this is variable tickers[0] : ");
    // console.log(tickers[0]);
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

function generatePortfolioTickersNEW(tickersInfo) {
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
        console.log("users loop started using tickerdata in function generatePortoflioTickersNEW");

// calculate the value of each portfolio item and total of portfolio
        var total = 0;
    for (let object of portfolio) {
      const  nameOfCoin = object.name.replace(/[^a-zA-Z0-9 ]/g, '');
      console.log(nameOfCoin);
      object['price_usd'] = tickersInfo[nameOfCoin].price_usd;
      object['value'] = object['balance'] * object['price_usd'];
      total += object['value'];
    }
      console.log("first users loop complete");

        const timestamp = admin.database.ServerValue.TIMESTAMP;
        console.log('generating portfolioTickers');
        const key2 = db.ref().child('Tickers').push().key;
        const path2 = '/PortfolioTickers/' + userKey + '/' + key2;
        let updates2 = {};
        updates2[path2] = {symbol: 'PORTF1', price_usd: total, balance: 1, time: timestamp};
     console.log(updates2);

// update Firebase with portfolio ticker
    // db.ref().update(updates2).then(function(results) {
  //     console.log('results', results);
  //   console.log("Send " + usersKeys.length + " portfolio Tickers to firebase");
  // }).catch(function(err) {
  //     console.log('err', err);
  // })
  }).catch(function(results) {
    console.log("generatePortfolioTickers function is not working properly");
    console.log('error:', results);
  });
}
})};

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

// saving market info from coinmarketcap for all coins in Firebase database each 10 minutes. Symbol of coin as key. [code can be removed after frontend distr]
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
  // update Firebase with market tickers, once every 15 minutes
    var db = admin.database();
    db.ref('market').update(marketInfo).then(results => {
    console.log('storing data in Firebase market folder worked');
  //after finishing saving the tickers run the portfolio tickers function for saving the tickers of individual users
    }).catch(err => {
    console.log('error:', err);
    })
  })
}
}

// saving market info in Firebase database each .. minutes with NAME as KEY
function saveMarketInfoNameAsKey() {
  for (i = 0; i < 17; i++) {

  let start = i * 100;
  console.log(start);
  rp('https://api.coinmarketcap.com/v2/ticker/?convert=BTC&start=' + start + '&limit=100').then(marketString => {
    market = JSON.parse(marketString);
    let marketInfoByName = {};
    keyList = Object.keys(market['data']);

    for (let item of keyList) {
      name = market['data'][item]['name'].replace(/[^a-zA-Z ]/g, '');

      marketInfoByName[name] = {
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

  // update Firebase with market price data, once every .. minutes
    var db = admin.database();
    db.ref('marketByName').update(marketInfoByName).then(results => {
    console.log('storing data in Firebase marketByName folder worked');
    //after finishing saving the tickers run the portfolio tickers function for saving the tickers of individual users
    }).catch(err => {
    console.log('error for saving marketByName:', err);
    })
  })
}
}




