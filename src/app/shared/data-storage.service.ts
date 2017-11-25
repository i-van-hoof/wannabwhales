import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/Rx';

import {CoinmarketService} from '../home/coinmarket.service';
import {CoinCryptocoin} from '../home/coinmarket.model';
import {PortfolioModel} from '../portfolio/portfolio.model';
import {TransactionService} from '../wish-list/transaction.service';
import {Transaction} from './transaction.model';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import {any} from 'codelyzer/util/function';
import Database = firebase.database.Database;
import 'rxjs/add/operator/map';
import { FirebaseApp } from 'angularfire2';




@Injectable()
export class DataStorageService {

 item: FirebaseObjectObservable<any>;

 //itemsRef: AngularFireList<any>;
 filteredItems = [];
 tickerValue = {};



  constructor(private http: Http,
              private coinMarketService: CoinmarketService,
              private transactionService: TransactionService,
              private authService: AuthService,
              public db: AngularFireDatabase,

              ) { }

  storeMarket() {
    return this.http.put('https://whales-app.firebaseio.com/market.json', this.coinMarketService
      .getMarket());
  }

  storeTicker99() {
    const database = firebase.database();
    const fruitRef = database.ref().child('Tickers');
    const marketticker = this.coinMarketService.getMarket();
    const timestamp = firebase.database.ServerValue.TIMESTAMP;
    var updates = {};
    for (let object of marketticker) {
      // const path = '/' + object['symbol'];
      const key = this.db.createPushId(); // Get a new unique key (locally, no network activity)
      const path = object['symbol'] + '/' + key;
      // updates[path + `/${key}`] = {symbol: object['symbol'], price_usd: object['price_usd'], balance: object['balance'], time: timestamp};
      updates[path] = {symbol: object['symbol'], price_usd: object['price_usd'], balance: object['balance'], time: timestamp};
     // console.log(updates);
    }
      console.log(updates);
      this.db.object('/Tickers').update(updates);}







  // storeTicker() {
  //   const timestamp = firebase.database.ServerValue.TIMESTAMP;
  //   var updates = {};
  //   for (let object of market) {
  //     const key = this.db.list('/Tickers').push().key; // Get a new unique key (locally, no network activity)
  //     const path = object['symbol'] + '/' + key;
  //     updates[path] = {symbol: object['symbol'], price_usd: object['price_usd'], balance: object['balance'], time: timestamp};
  //   }
  //   this.db.object('/Tickers').update(updates);
  // }

//   var userId = 1234
//   var photos = firebase.database().ref(‘photos/’);
//   var newPhotoKey = this.photos.push().key
//   var newPhoto = {};
//   newPhoto[`/photos/${newEventKey}`] = {
//     url: ‘http://firebasestorage.com/image1,
//     likes: 0
// };

//   storeTicker99() {
//     const marketticker1 = this.coinMarketService.getMarket99();
//    // const portfolioticker = this.coinMarketService.getPortfolio();
//    const timestamp1 = firebase.database.ServerValue.TIMESTAMP;
//     console.log(marketticker1);
//
//     for (let object of marketticker1) {
//       const path1 = object['symbol'];
//       console.log(path1);
//      // console.log(path);
//      const itemsRef = this.db.list('Tickers/' + path1);
//      itemsRef.push({ symbol: path1, price_usd: object['price_usd'], balance: object['balance'], time: timestamp1});
//     }
// }

  storeTicker199() {
    const marketticker2 = this.coinMarketService.getMarket199();
    // const portfolioticker = this.coinMarketService.getPortfolio();
    const timestamp2 = firebase.database.ServerValue.TIMESTAMP;
    console.log(marketticker2);

    for (let object of marketticker2) {
      const path2 = object['symbol'];
      console.log(path2);
      // console.log(path);
      const itemsRef = this.db.list('Tickers/' + path2);
      itemsRef.push({ symbol: path2, price_usd: object['price_usd'], balance: object['balance'], time: timestamp2});
    }
  }

  storeTicker299() {
    const marketticker3 = this.coinMarketService.getMarket299();
    // const portfolioticker = this.coinMarketService.getPortfolio();
    const timestamp3 = firebase.database.ServerValue.TIMESTAMP;
    console.log(marketticker3);

    for (let object of marketticker3) {
      const path3 = object['symbol'];
      console.log(path3);
      // console.log(path);
      const itemsRef = this.db.list('Tickers/' + path3);
      itemsRef.push({ symbol: path3, price_usd: object['price_usd'], balance: object['balance'], time: timestamp3});
    }
  }

  retrieveTicker(tickerSymbol) {
    const itemsRef2 = this.db.list('Tickers/' + tickerSymbol).snapshotChanges();
    itemsRef2.subscribe( data => {
      if (data) {
        // console.log('there is ticker data');
        this.filteredItems = [];
        data.map( test => {
          this.tickerValue = test.payload.toJSON();

          // console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
          this.filteredItems.push([this.tickerValue['time'], this.tickerValue['price_usd']]);
        });
        console.log(this.filteredItems);
        this.coinMarketService.setTicker(this.filteredItems);
        return this.filteredItems;
      }})}

  // retrieveTickerList() {
  //   const itemsRef3 = this.db.list('Tickers/BTC').snapshotChanges();
  //   itemsRef3.subscribe( data => {
  //     if (data) {
  //       console.log('there is ticker data');
  //       data.map( test => {
  //         this.tickerList = test.payload.toJSON();
  //
  //         console.log(this.tickerList);
  //         this.filteredItems.push([this.tickerValue['time'], this.tickerValue['price_usd']]);
  //         return this.filteredItems;
  //       });
  //     }})}

  storePortfolio() {
    //  const token = this.authService.getToken();
    return this.http.put('https://whales-app.firebaseio.com/market.json', this.coinMarketService
      .getPortfolio());
  }

  storeTransactions() {
    const token = this.authService.getToken();
    return this.http.put('https://whales-app.firebaseio.com/transactions.json?auth=' + token, this.transactionService
      .getTransactions());
  }

  // getPortfolio() {
  //   // const token = this.authService.getToken();
  //   this.http.get('https://whales-app.firebaseio.com/portfolio.json')
  //     .map(
  //       (response: Response) => {
  //         const portfolio: PortfolioModel[] = response.json();
  //         return portfolio;
  //
  //       }
  //     )
  //     .subscribe(
  //       (portfolio: PortfolioModel[]) => {
  //         this.coinMarketService.setPortfolio(portfolio);
  //       }
  //     );
  // }

  getBooksAndMovies() {
      return Observable.forkJoin(
      this.http.get('https://whales-app.firebaseio.com/market.json')
        .map((res: Response) => res.json()),
      this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=250')
        .map((res: Response) => res.json())
      )
        .subscribe( (Observable) => {
            console.log(Observable[0]);
            console.log(Observable[1]);
          for (let object of Observable[1]) {
          const index3 = Observable[0].findIndex(p => p.symbol === object.symbol);
            object['price_usd'] = +object['price_usd'];
            if (index3 >= 0) {object['balance'] = Observable[0][index3].balance; object['value'] = Observable[0][index3].balance * object['price_usd'] ; } else {object['balance'] = 0; }
            if (index3 >= 0) {object['inportfolio'] = Observable[0][index3].inportfolio; } else {object['inportfolio'] = false; }
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
            this.coinMarketService.setCoinmarket(Observable[1]);
            this.coinMarketService.setPortfolio(Observable[1]);

      }) ;
    }

  getServerTransactions() {
    this.http.get('https://whales-app.firebaseio.com/transactions.json')
      .map(
        (response: Response) => {
          const transactions: Transaction[] = response.json();
          return transactions;
        }
      )
      .subscribe(
        (transactions: Transaction[]) => {
          this.transactionService.setTransactions(transactions);
        }
      );
  }
}


// De oude code om coinmarket cap op te halen via http

// getCoinmarket() {
//   const array = [ {symbol: 'BTC', name: 'Bitcoin'}, {symbol: 'DASH', name: 'Dash'} ];
//   this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=150')
//     .map(
//       (response: Response) => {
//         const coinmarket: CoinCryptocoin[] = response.json();
//         for (let object of coinmarket) {
//           for (let item of array) {
//             if (item.symbol === object['symbol']) {object['inportfolio'] = true; console.log('PortfolioItem'); break; } else {object['inportfolio'] = false; }
//           }
//             object['balance'] = 0;
//             object['volume_24h'] = object['24h_volume_usd'];
//             object['volume_24h'] = +object['volume_24h'];
//             object['last_updated'] = +object['last_updated'];
//             object['market_cap_usd'] = +object['market_cap_usd'];
//             object['price_btc'] = +object['price_btc'];
//             object['price_usd'] = +object['price_usd'];
//             object['percent_change_1h'] = +object['percent_change_1h'];
//             object['percent_change_24h'] = +object['percent_change_24h'];
//             object['percent_change_7d'] = +object['percent_change_7d'];
//             object['available_supply'] = +object['available_supply'];
//             object['total_supply'] = +object['total_supply'];
//             object['last_updated'] = +object['last_updated'];
//             delete object['24h_volume_usd'];
//         }
//
//         return coinmarket;
//       }
//     )
//     .subscribe(
//       (coinmarket: CoinCryptocoin[]) => {
//         this.coinMarketService.setCoinmarket(coinmarket);
//       }
//     );
// }
