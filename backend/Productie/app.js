//https://whales-app.firebaseio.com/market.json


//https://api.coinmarketcap.com/v1/ticker/?limit=250


var rp = require("request-promise");
var firebase = require('firebase');
// var FirebaseTokenGenerator = require("firebase-token-generator");
// var admin = require("firebase-admin");
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

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: 'whalesapp-dev',
//     clientEmail: 'whalesapp-servlet@whalesapp-dev.iam.gserviceaccount.com',
//     private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQlIUx5tg/YGnM\nGhU5ZXdytfV/9KhAUyl1RGtWo0M4ekstPLYRuZ89U8TAu+YtaR8yNPN9+C/GMiNb\nvsgJGoGBfcvuuaHW/6PZ0ZkY0s2WuSzZW18PPdq1P9Epn/QZhR3WMwF8eUITjiF7\nRcNVpFtqStOpORXMAQApmsW/L7xsEgcGoNVorLtvGOsSwgBmcVWSgI1i7W2RbUTX\nTT8YyQV/6n1L+oLIAk0p80o+xE/BaC4aQvR2GQq3wqdzhQP6pox7YO+yYSqXh1rh\n/HOqi0T3xPFYdssDanA0Xf067HhMFCgZRk1rHnvnqz/ExVmPbouHg3JjxsUIo4hJ\nzhyMsl3RAgMBAAECggEAA4VSR0Cci1tTBds12wFrtf+8zGNimK1esIhOYIjCeHhV\n/wY8k4mE1tnsYw146fDRkj0jFBAFrGyJvMF4anDsWTV4pQe0o+auSx223hym1EG9\ncFDSxrTWVYNlgjSdP/YHhidXwdRhKWfXiFdp3+71jRKExqE8TTSCHnGqn1rMrS1L\n5gzfONwJYYYuUBYFXWEZf5PdawBMW41I5aNzO/E0jQvd6kAYVDxSAv9t8lZbXYsH\nU3AbPPtDF6aausbueArbsi5Hx8tmjeH9JpvDYt+vvaiMHE5m4wDwYetWH7k+9jpt\nr3jHwhudF8I96iKpuZXJvHelJbyOOHSEm2ul2FtPUQKBgQD6WqIqjihvUPwZSFHH\niyRqQGJdMJOZ0oiKM3lRPTxNFi7KTvF1hTUrbc/lGyBwXWLQpeLLRqXPfzO1GKvN\nHxHKuBMN/jBwy/j8mPzfQm/kJtVJghgOg8+6HgIarF+eXNn6eLH4e0eKtq0Dp1bI\nW6sfYQKxrDTVkpMibSnP67Nt2QKBgQDVSLbPBBx0Ba8q8EFBuzNCwPAyMdaIg3IE\npt8fz0yBR1Rh6LoBjlKoSRUApPy+9VCL6xsZ8xv4xJNBaN6YdkMvyl4luMbU66eV\noMgKvg9Rdo+OpbZ0b3If7vfY0tjTztrbNazAG1EjqzeVwgGL4VHXHprCmIOKNzz8\n/QnT8j5cuQKBgQD07fjbs2rBxTRus782ft2oicbyLxUol733n3ZgUY2OSVaLnQJE\nHIexLmUHWyu4YtTLFpA0mbCcuXDoCvQB4RSyBLa3qOjRYez9i9tRvZjkWE2w9fL9\nOF3hU3xxhhSiRWsIzk4nsMyEXEYWXf/cUzqun2VYWAb0r8r9Elmmzo0juQKBgCMc\nnmPENH7xNJ4oAUY18EFsC97nj37XzNxxMEhHUzvxJzYbHwwEhx0HMvrxLl6tef4e\nzU5fVFqG2gspnYOR7IugkBE7sxf4V5Vta6FBGrp5fzanlzrh4fLZ31mFlIaCBkuS\nMYdKt/fcRwFTd/e0N0nn0uh4PSdy4opvib+noJaZAoGAPEsPrt/c50552LJw+unY\nYCNI9DICsUwbNKFKmsCvWf8C0CaWfLhFMLs7t+Ey4gAlQ3RSbGIy7gx2pIJ0OP7E\nyQCgRQTvL65/NV56JaeQWUZ3CyfLwxyfTXT8Kzheh1kh8w2uy0SU86TJs6p8j3Jc\n2o1uAG/dB0SjP4BzjQwSreA=\n-----END PRIVATE KEY-----\n',
//   }),
//   databaseURL: 'https://whalesapp-dev.firebaseio.com'
// });

// run Firebase SDK with admin rights
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://whalesapp-dev.firebaseio.com'
// });

// existing code for initializing Firebase SDK
firebase.initializeApp(environment.firebase);


// // generating token for accessing Firebase Real Time Database
// var tokenGenerator = new FirebaseTokenGenerator('6SqY8xYJ1d6wRYK7mZudWKjMAGP4RTBG9pa4YDXf');
// var token = tokenGenerator.createToken(
//   {uid: 'Ivanho79_TTM'},
//   { expires: 600000000000 });
// console.log(this.token);

// // method for creating custom tokens
// firebase.auth().signInWithCustomToken(token).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   console.log(errorCode);
//   console.log(errorMessage);
// });



var CronJob = require('cron').CronJob;
const cron1 = new CronJob('0 0 * * * *', function() {
   getMarketData();
  // console.log('working1');
}, null, true, 'Europe/Amsterdam');

// tweede cronjob for saving market summary
const cron2 = new CronJob('0 0,15,30,45 * * * *', function() {
  getMarketSummary();
  // console.log('working2');
}, null, true, 'Europe/Amsterdam');

// new function for getting the market summary form the CoinmarketCap API
function getMarketSummary() {
  console.log("Getting market summary data");
rp('https://api.coinmarketcap.com/v1/global/')
  .then(globalString => {
      marketSummary = JSON.parse(globalString);

  // NEW CODE prepare an json object with market summary for Firebase
  console.log('generating json object market summary');
  const key3 = firebase.database().ref().child('MarketSummary').push().key;
  console.log(key3);
  const path3 = '/MarketSummary/CoinMarketCap/' + key3;
  console.log(path3);
  let updates3 = {};

  // OUDE CODE
  // const timestamp3 = firebase.database.ServerValue.TIMESTAMP;
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

//
function getMarketData() {
    var total = 0;
    console.log("Getting market data");
rp('https://whalesapp-dev.firebaseio.com/UserPortfolios/V0uICQbXrnfCryghTkRpmbv4sBn2.json')
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
        const path2 = '/PortfolioTickers/UserId/' + key2;
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
