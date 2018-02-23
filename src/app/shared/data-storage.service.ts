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
// import Database = firebase.database.Database;
import 'rxjs/add/operator/map';
import {PortfolioEditComponent} from '../portfolio/portfolio-edit/portfolio-edit.component';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class DataStorageService {

 item: FirebaseObjectObservable<any>;
 // itemsRef: AngularFireList<any>;
 filteredItems = [];
 userLogedIn: any;
 filteredSummaryItems = [];
 filteredtestArray = [];
 filteredPortfolioItems = [];
 tickerValue = {};
 summaryTickerValue = {};
 portfolioTickerValue = {};
 userId: string;
 testArray = {};

  // Bittrex API code work in progress
  // const secret = '78f97d0ee39042a99d5a8d02d86ab4a2';

  constructor(private http: Http,
              private coinMarketService: CoinmarketService,
              private transactionService: TransactionService,
              private authService: AuthService,
              public  db: AngularFireDatabase,
              private afAuth: AngularFireAuth

              ) {this.afAuth.authState.subscribe(user => {
                  if(user) this.userId = user.uid
  })}


  retrieveTicker(tickerSymbol) {
    const itemsRef = this.db.list('Tickers/' + tickerSymbol).snapshotChanges();
    itemsRef.subscribe( data => {
      if (data) {
        // console.log('there is ticker data');
        this.filteredItems = [];
        data.map( tickerData => {
          this.tickerValue = tickerData.payload.toJSON();
          // console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
          this.filteredItems.push([this.tickerValue['time'], this.tickerValue['price_usd']]);
        });
       // console.log(this.filteredItems);
        this.coinMarketService.setTicker(this.filteredItems);
        return this.filteredItems;
      }})};

  retrievePortfolioTicker(portfolioTickerSymbol) {
    if (this.authService.isAuthenticated()) {
      console.log("getting portfolio ticker from firebase");
      const itemsRef = this.db.list('PortfolioTickers/' + portfolioTickerSymbol).snapshotChanges();
      itemsRef.subscribe(data => {
        if (data) {
          // console.log('there is ticker data');
          this.filteredPortfolioItems = [];
          data.map(tickerData => {
            this.portfolioTickerValue = tickerData.payload.toJSON();
            console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
            this.filteredPortfolioItems.push([this.portfolioTickerValue['time'], this.portfolioTickerValue['price_usd']]);
          });
          console.log(this.filteredPortfolioItems);
          this.coinMarketService.setPortfolioTicker(this.filteredPortfolioItems);
          return this.filteredPortfolioItems;
        }
      })
    } else {
      console.log('user not authenticated')
    }
  };

  retrieveTest() {
    if (this.authService.isAuthenticated()) {
      console.log("getting portfolio ticker from firebase");
      const itemsRef = this.db.list('UserPortfolios/V0uICQbXrnfCryghTkRpmbv4sBn2').snapshotChanges();
      itemsRef.subscribe(data => {
        if (data) {
          this.filteredtestArray = [];
          console.log(data);
          data.map(tickerData => {
            this.testArray = tickerData.payload.toJSON();
            this.filteredtestArray.push(this.testArray);
          });
           console.log(this.filteredtestArray);
        }
      })
    } else {
      console.log('no data from test')
    }
  };

  // code for retrieving ticker of total portfolio value
  retrieveSummaryTicker(DataProvider) {
    const itemsRef = this.db.list('MarketSummary/' + DataProvider).snapshotChanges();
    itemsRef.subscribe( data => {
      if (data) {
        // console.log('there is ticker data');
        this.filteredSummaryItems = [];
        data.map( tickerData => {
          this.summaryTickerValue = tickerData.payload.toJSON();
          // console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
          this.filteredSummaryItems.push([this.summaryTickerValue['time'], this.summaryTickerValue['total_market_cap_usd']]);
        });
        // console.log(this.filteredPortfolioItems);
        this.coinMarketService.setSummaryTicker(this.filteredSummaryItems);
        return this.filteredSummaryItems;
      }})};

  storeMarket() {
    return this.http.put('https://whales-app.firebaseio.com/market.json', this.coinMarketService
      .getMarket());
  }

  storePortfolio() {
    const token = this.authService.getToken();
    const UserId = this.authService.getUserId();
    // return this.http.put('https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json?auth=' + token , this.coinMarketService
    return this.http.put('https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json?auth=' + token , this.coinMarketService

      .getPortfolio());
  }

  storeTransactions() {
    const token = this.authService.getToken();
    return this.http.put('https://whales-app.firebaseio.com/transactions.json?auth=' + token, this.transactionService
      .getTransactions());
  }

  getUserPortfolio() {
        if (this.authService.isAuthenticated()) {
          console.log('Authenticated: Start fetching portfolio data');
          const token = this.authService.getToken();
          const UserId = this.authService.getUserId();
          // const userName = this.authService.getUserName();
          // this.userLogedIn = 'https://whalesapp-test-mr2.firebaseio.com/UserPortfolios/V0uICQbXrnfCryghTkRpmbv4sBn2.json?auth=' + token;
          this.userLogedIn = 'https://whalesapp-dev.firebaseio.com/UserPortfolios/'+ UserId + '.json?auth=' + token;
          // this.userLogedIn = 'https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json';
          console.log('logged in and fetching data from location:', this.userLogedIn);
          } else {
          this.userLogedIn = 'https://whalesapp-dev.firebaseio.com/UserPortfolios/Akg620apdUMJSgTowufZe7QHGCo1.json'
            }
      return Observable.forkJoin(

      this.http.get(this.userLogedIn)
        .map((res: Response) => res.json()),
      this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=275')
        .map((res: Response) => res.json())
      )
        .subscribe( (Observable) => {
             console.log(Observable[0]);
            // console.log(Observable[1]);
          let total = 0;
          for (let object of Observable[1]) {
          const index3 = Observable[0].findIndex(p => p.symbol === object.symbol);
            object['price_usd'] = +object['price_usd'];
            if (index3 >= 0) {object['balance'] = Observable[0][index3].balance; object['value'] = Observable[0][index3].balance * object['price_usd'] ; total += object['value'];} else {object['balance'] = 0; }
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

            // console.log('total portfolio value');
            // console.log(total);
          }
           //  console.log(total);
            Observable[1].push({id: 'Portfolio_UsID', name: 'Portfolio1', symbol: 'PORTF', rank: '1000', price_usd: total, price_btc
              : 1, balance: 1
               });
              // console.log(this.portfolioEditComponent.editMode);
            if (this.authService.editMode === false) {
              this.coinMarketService.setCoinmarket(Observable[1]);
              this.coinMarketService.setPortfolio(Observable[1]);
            } else { console.log('is in Edit Mode')}

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
