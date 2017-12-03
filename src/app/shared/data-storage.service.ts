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
import Database = firebase.database.Database;
import 'rxjs/add/operator/map';


@Injectable()
export class DataStorageService {

 item: FirebaseObjectObservable<any>;
 //itemsRef: AngularFireList<any>;
 filteredItems = [];
 filteredSummaryItems = [];
 filteredPortfolioItems = [];
 tickerValue = {};
 summaryTickerValue = {};
 portfolioTickerValue = {};

  constructor(private http: Http,
              private coinMarketService: CoinmarketService,
              private transactionService: TransactionService,
              private authService: AuthService,
              public db: AngularFireDatabase,

              ) { }

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
      }})}

  // code for retrieving ticker of total portfolio value

  retrievePortfolioTicker(portfolioTickerSymbol) {
    const itemsRef = this.db.list('PortfolioTickers/' + portfolioTickerSymbol).snapshotChanges();
    itemsRef.subscribe( data => {
      if (data) {
        // console.log('there is ticker data');
        this.filteredPortfolioItems = [];
        data.map( tickerData => {
          this.portfolioTickerValue = tickerData.payload.toJSON();
          // console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
          this.filteredPortfolioItems.push([this.portfolioTickerValue['time'], this.portfolioTickerValue['price_usd']]);
        });
       // console.log(this.filteredPortfolioItems);
        this.coinMarketService.setPortfolioTicker(this.filteredPortfolioItems);
        return this.filteredPortfolioItems;
      }})};

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
    //  const token = this.authService.getToken();
    return this.http.put('https://whales-app.firebaseio.com/market.json', this.coinMarketService
      .getPortfolio());
  }

  storeTransactions() {
    const token = this.authService.getToken();
    return this.http.put('https://whales-app.firebaseio.com/transactions.json?auth=' + token, this.transactionService
      .getTransactions());
  }

  getBooksAndMovies() {
      return Observable.forkJoin(
      this.http.get('https://whales-app.firebaseio.com/market.json')
        .map((res: Response) => res.json()),
      this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=275')
        .map((res: Response) => res.json())
      )
        .subscribe( (Observable) => {
          //  console.log(Observable[0]);
          //  console.log(Observable[1]);
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
