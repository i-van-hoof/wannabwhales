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

// cronjob for saving market summary
var CronJob = require('cron').CronJob;

const cron1 = new CronJob('0 0,15,30,45 * * * *', function() {
  getMarketSummaryPro();
}, null, true, 'Europe/Amsterdam');

const cron2 = new CronJob('0 0,15,30,45 * * * *', function() {
  saveMarketInfoNameAsKey();
}, null, true, 'Europe/Amsterdam');

// //  getting the market summary data from the Coinmarketcap API
// function getMarketSummary() {
//   console.log("Getting market summary data");
//   rp('https://api.coinmarketcap.com/v1/global/')
//     .then(globalString => {
//     marketSummary = JSON.parse(globalString);

//     // prepare an json object with market summary for Firebase
//   console.log('generating json object market summary');
//   var db = admin.database();
//   const key = db.ref().child('MarketSummary').push().key;
//   console.log(key);
//   const path = '/MarketSummary/CoinMarketCap/' + key;
//   console.log(path);
//   let updates = {};

//   // code voor timestamp met firebase als niet inloggen met admin rights
//   // const timestamp = firebase.database.ServerValue.TIMESTAMP;
//   const timestamp = admin.database.ServerValue.TIMESTAMP;
//   updates[path] = {
//     symbol: 'MARKETSUM',
//     total_market_cap_usd: marketSummary['total_market_cap_usd'],
//     total_24h_volume_usd: marketSummary['total_24h_volume_usd'],
//     bitcoin_percentage_of_market_cap: marketSummary['bitcoin_percentage_of_market_cap'],
//     active_currencies: marketSummary['active_currencies'],
//     active_assets: marketSummary['active_assets'],
//     active_markets: marketSummary['active_markets'],
//     time: timestamp };
//   // console.log(updates);
//   return db.ref().update(updates).then(function(results) {
//     console.log('results', results);
//     console.log("Sent market summary from Coinmarket cap to Firebase");
//   }).catch(err => {
//     console.log('err', err);
//   })
// })
// }

// function for getting market summary from coinmarket cap pro api

function getMarketSummaryPro() {

  const requestOptionsSummary = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
    headers: {
      'X-CMC_PRO_API_KEY': 'e196f820-0be5-4c0e-8e6a-bb6b54b7f290'
    },
    json: true,
    gzip: true
  };

  rp(requestOptionsSummary).then(marketSummary => {
    const marketSummaryList = marketSummary['data'];

  // prepare an json object with market summary for Firebase
    var db = admin.database();
    const key = db.ref().child('MarketSummary').push().key;
    const timestamp = admin.database.ServerValue.TIMESTAMP;
    const path = '/MarketSummary/CoinMarketCap/' + key;
    let updates = {};

    updates[path] = {
      symbol: 'MARKETSUM',
      total_market_cap_usd: marketSummaryList['quote']['USD'].total_market_cap,
      total_24h_volume_usd: marketSummaryList['quote']['USD'].total_volume_24h,
      bitcoin_percentage_of_market_cap: marketSummaryList.btc_dominance ,
      active_currencies: marketSummaryList.active_cryptocurrencies,
      active_exchanges: marketSummaryList.active_exchanges,
      active_markets: marketSummaryList.active_market_pairs,
      time: timestamp
    };

    console.log('marketsummary from cmc pro API' , updates);
    return db.ref().update(updates).then(function(results) {
      console.log('results', results);
      console.log("Sent market summary from Coinmarket cap to Firebase");
    }).catch(err => {
      console.log('err', err);
    })
  })
}

// saving market info in Firebase database each .. minutes with NAME as KEY
function saveMarketInfoNameAsKey() {

  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      start: 1,
      limit: 400,
      convert: 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': 'e196f820-0be5-4c0e-8e6a-bb6b54b7f290'
    },
    json: true,
    gzip: true
  };

  rp(requestOptions).then(market => {

    const marketList = market['data'];
    let tickerUpdates = {};
    let marketInfoByName = {};
    let marketInfo = {};
    var db = admin.database();
    const key = db.ref().child('Tickers').push().key;
    const timestamp = admin.database.ServerValue.TIMESTAMP;

    for (let item of marketList) {
      const name = item.name.replace(/[^a-zA-Z0-9 ]/g, '');
      const symbol= item.symbol.replace(/[^a-zA-Z0-9 ]/g, '');
      let portfolioArray = [];

      // const timestamp = admin.database.ServerValue.TIMESTAMP;
      const tickersPath = '/Tickers/' + symbol + '/' + key;

      tickerUpdates[tickersPath] = {
        symbol: symbol,
        rank: item.cmc_rank,
        price_usd: item['quote']['USD'].price,
        market_cap_usd: item['quote']['USD'].market_cap,
        time: timestamp };

      const round = {
        id: item.id,
        name: name,
        symbol: symbol,
        website_slug: item.slug,
        rank: item.cmc_rank,
        circulating_supply: item.circulating_supply,
        total_supply: item.total_supply,
        price_usd: item['quote']['USD'].price,
        // price_btc: item['quote']['BTC'].price,
        volume_24h: item['quote']['USD'].volume_24h,
        market_cap: item['quote']['USD'].market_cap,
        percent_change_1h: item['quote']['USD'].percent_change_1h,
        percent_change_24h: item['quote']['USD'].percent_change_24h,
        percent_change_7d: item['quote']['USD'].percent_change_7d,
        last_updated: (new Date(item['quote']['USD'].last_updated)/1000).valueOf()
      }

      marketInfoByName[name] = round;
      portfolioArray.push(round);

    };
    console.log(portfolioArray[1])

  //   storePortfolio() {
  //     const portfolioUpdate = this.coinMarketService.getPortfolioData();
  //     console.log(portfolioUpdate);
  //     const newPortfolio = {};
  //     this.portfolioArray = [];
  //     for (let object of portfolioUpdate) {
  //       if (object['inportfolio'] === true) {
  //         this.portfolioArray.push({
  //           symbol: object['symbol'],
  //           id: object['id'],
  //           inportfolio: true,
  //           balance: object['balance'],
  //           name: object['name'],
  //           value: object['y']
  //         }); }}
  //     console.log(this.userId);
  //     newPortfolio[this.userId] = this.portfolioArray;
  //     console.log('next step is saving portfolio: ' + JSON.stringify(this.portfolioArray));
  //     this.portfolioRef = this.db.object('UserPortfolios/');
  //     this.portfolioRef.update(newPortfolio);
  //   }
  // }

    generatePortfolioTickersNEW(marketInfoByName);

    // update Firebase with market tickers, once every 15 minutes
    db.ref().update(tickerUpdates).then(results => {
      // console.log('results', results);
      // after finishing saving the tickers run the portfolio tickers function for saving the tickers of individual users
      }).catch(err => {
      console.log('err', err);
      })

  // update Firebase with market price data, once every .. minutes
    db.ref('marketByName').update(marketInfoByName).then( () => {
    console.log('storing data in Firebase marketByName folder worked');
    //after finishing saving the tickers run the portfolio tickers function for saving the tickers of individual users
    }).catch(err => {
    console.log('error for saving marketByName:', err);
    })

    // marketinfo by Symbol (can be removed after front-end update)
    for (let item of marketList) {
      symbol = item.symbol.replace(/[^a-zA-Z0-9 ]/g, '');

      marketInfo[symbol] = {
        id: item.id,
        name: item.name.replace(/[^a-zA-Z0-9 ]/g, ''),
        symbol: symbol,
        website_slug: item.slug,
        // rank: item.cmc_rank,
        circulating_supply: item.circulating_supply,
        total_supply: item.total_supply,
        price_usd: item['quote']['USD'].price,
        // price_btc: item['quote']['BTC'].price,
        volume_24h: item['quote']['USD'].volume_24h,
        market_cap: item['quote']['USD'].market_cap,
        percent_change_1h: item['quote']['USD'].percent_change_1h,
        percent_change_24h: item['quote']['USD'].percent_change_24h,
        percent_change_7d: item['quote']['USD'].percent_change_7d,
        last_updated: (new Date(item['quote']['USD'].last_updated)/1000).valueOf()
      }
    }
  // update Firebase with market tickers, once every .. minutes
    db.ref('market').update(marketInfo).then(results => {
    console.log('storing data in Firebase market folder worked' , results);
    }).catch(err => {
    console.log('error:', err);
    })
  })
}

function generatePortfolioTickersNEW(tickersInfo) {
  var db = admin.database();
  db.ref('users').once('value')
    .then(userdata => {
    users = userdata.val();
    let usersKeys = Object.keys(users);

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
      if (typeof tickersInfo[nameOfCoin] !== 'undefined') {
        object['value'] = object['balance'] * tickersInfo[nameOfCoin].price_usd
      }
      total += object['value'];
    }
    const timestamp = admin.database.ServerValue.TIMESTAMP;
    const key2 = db.ref().child('Tickers').push().key;
    const path2 = '/PortfolioTickers/' + userKey + '/' + key2;
    let updates2 = {};
    updates2[path2] = {symbol: 'PORTF1', price_usd: total, balance: 1, time: timestamp};
// update Firebase with portfolio ticker
    db.ref().update(updates2).then(function(results) {
      console.log('results', results);
      console.log("Send " + usersKeys.length + " portfolio Tickers to firebase");
   }).catch(function(err) {
      console.log('err updating Firebase with portfolioTickers', err);
   })
  }).catch(function(results) {
    console.log("generatePortfolioTickers function is not working properly");
    console.log('error:', results);
  });
}
})};
