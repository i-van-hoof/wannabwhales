import { Injectable } from '@angular/core';
import { Http, Response, Headers, Jsonp } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { CoinmarketService } from '../home/coinmarket.service';
import { TransactionService } from '../wish-list/transaction.service';
import { Transaction } from './transaction.model';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/map';
// import {PortfolioEditComponent } from '../portfolio/portfolio-edit/portfolio-edit.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { Item } from '../items/shared/item';
import { portfolioDataModel } from '../home/portfolio-data.model';
// import {CoinCryptocoin} from '../home/coinmarket.model';
// import {PortfolioModel} from '../portfolio/portfolio.model';
// import {map} from 'rxjs/operators';

@Injectable()
export class DataStorageService {
  filteredItems = [];
  userLogedIn: any;
  filteredSummaryItems = [];
  filteredtestArray = [];
  filteredPortfolioItems = [];
  tickerValue: any;
  tickerSymbol = '';
  summaryTickerValue = {};
  portfolioTickerValue = {};
  userId: string;
  user: Observable<firebase.User>;
  marketSummaryRef: AngularFireObject<any>;
  userPortfolioRef: AngularFireObject<any>;
  // Firebase reference for market info
  portfolioRef: AngularFireObject<any>;
  testRef: AngularFireList<any>;
  items: any;
  // items: AngularFireList<any>;
  portfolio = [];
  userPortfolio = [];
  portfolioSummary = {};
  portfolioArray = [];
  coin: string;
  apiRoot = 'https://api.coinmarketcap.com/v1/ticker/';
  results = [];
  resultsCall = [];
  loading: boolean;

  constructor(private http: Http,
              private coinMarketService: CoinmarketService,
              private transactionService: TransactionService,
              private authService: AuthService,
              public  db: AngularFireDatabase,
              private af: AngularFireAuth,
              ) {
                    this.user = af.authState;
                    this.af.authState.subscribe(user => {
                      if (user) { this.userId = user.uid; }
                    });
                    this.results = [];
                    this.loading = false;
                  }

  getUserPortfolioAuth() {
    this.af.authState.first().toPromise().then
    (user => {if (user) {this.getUserPortfolio(); console.log('auth worked'); } });
  }

  // getMarketData(order: string, start: any,  limit: number) {
  //     this.loading = true;
  //     this.items = this.db.list('marketByName', ref => ref.orderByChild(order).startAt(start).limitToFirst(limit))
  //       .valueChanges()
  //       .subscribe(marketData => {
  //         console.log(marketData);
  //         this.results = marketData;
  //         this.coinMarketService.setMarketData(this.results);
  //         this.loading = false;
  //       });
  //   }

    getMovies(startAt) {
      const test  =  'Bitcoin  ';
      return this.db.list('marketByName', ref => ref.orderByKey().startAt(startAt));
      // .endAt(startAt + '\uf8ff'));
    }

  getUserPortfolio() {
    this.userPortfolio = [];
    this.userPortfolioRef = this.db.object(`UserPortfolios/${this.userId}`);
    // method with Promise
    this. userPortfolioRef
      .snapshotChanges()
      .map(res => { this.userPortfolio = res.payload.val(); })
      .first()
      .toPromise().then(() =>
      this.firebaseQuery(this.userPortfolio))
      .catch(result => console.log('Promise not working', result));
  }

  firebaseQuery(portfolio: portfolioDataModel[]) {
    const coinsToFetch = [];
    for (const coinItem of portfolio) {
      coinsToFetch.push(coinItem['name']); }
      console.log('Fetched coins from UserPortfolio in Firebase: ' + coinsToFetch);

    // Map the Firebase promises into an array
    const coinPromises = coinsToFetch.map(id => {
      const idDatabase =  id.replace(/[^a-zA-Z0-9 ]/g, '');
      return this.db.object('marketByName/' + idDatabase).valueChanges().first().toPromise();
      });
    // Wait for all the async requests mapped into
    // the array to complete
    Promise.all(coinPromises)
      .then(coins => {
          coins.forEach((value, index) => {
            portfolio[index]['y'] = portfolio[index]['balance'] * value['price_usd'];
            portfolio[index]['previous_value'] = portfolio[index]['value'];
            delete portfolio[index]['value'];
            portfolio[index]['volume_24h'] = value['volume_24h'];
            portfolio[index]['last_updated'] = value['last_updated'];
            portfolio[index]['market_cap_usd'] = value['market_cap'];
            portfolio[index]['price_usd'] = value['price_usd'];
            portfolio[index]['price_btc'] = value['price_btc'];
            portfolio[index]['percent_change_1h'] = value['percent_change_1h'];
            portfolio[index]['percent_change_24h'] = value['percent_change_24h'];
            portfolio[index]['percent_change_7d'] = value['percent_change_7d'];
            portfolio[index]['total_supply'] = value['total_supply'];
            portfolio[index]['available_supply'] = value['circulating_supply'];
          });
          console.log(portfolio);
      })
      .catch(err => {
        console.log(err, 'error');
      });
      this.coinMarketService.setPortfolioData(portfolio);
      if (this.authService.editMode === false) {
        this.coinMarketService.setPortfolioData(portfolio);
              } else { console.log('is in Edit Mode'); }
  }

  getHTTPcall(type: string, coin: string, start: number,  limit: number) {
    let promise = new Promise((resolve, reject) => {
    let apiURL = `${this.apiRoot}${coin}/?start=${start}&limit=${limit}`;
      // console.log(apiURL);
      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            // console.log('data received from coinmarketcap');
            this.resultsCall = res.json();
            for (let object of this.resultsCall) {
              object['rank'] = +object['rank'];
              object['price_usd'] = +object['price_usd'];
              object['price_btc'] = +object['price_btc'];
              object['volume_24h'] = object['24h_volume_usd'];
              object['volume_24h'] = +object['volume_24h'];
              object['market_cap_usd'] = +object['market_cap_usd'];
              object['available_supply'] = +object['available_supply'];
              object['total_supply'] = +object['total_supply'];
              object['max_supply'] = +object['max_supply'];
              object['percent_change_1h'] = +object['percent_change_1h'];
              object['percent_change_24h'] = +object['percent_change_24h'];
              object['percent_change_7d'] = +object['percent_change_7d'];
              object['last_updated'] = +object['last_updated'];
              delete object['24h_volume_usd'];
            }
            if (type === 'market') {
              console.log('setMarketData() from datastorage');
              this.coinMarketService.setMarketData(this.resultsCall);
            } else {
              console.log('setportfolio from datastorage');
              this.coinMarketService.setPortfolio(this.resultsCall);
            }
            resolve();
          },
          msg => { // error
          reject(msg);
          }
        );
    });
    return promise;
  }

  retrieveTicker(tickerSymbol) {
    this.tickerSymbol = tickerSymbol;
    return this.db.list('Tickers/' + this.tickerSymbol, ref => ref.limitToLast(200)).valueChanges();
  }

  retrievePortfolioTicker(Range) {
     if (!this.userId) return;
      const items = this.db.list(`PortfolioTickers/${this.userId}` , ref => ref.limitToLast(Range)).valueChanges();
      items.subscribe( data => {
      if (data) {
        // console.log('there is ticker data');
        this.filteredPortfolioItems = [];
        data.map(tickerData => {
          this.filteredPortfolioItems.push([tickerData['time'], tickerData['price_usd']]);
        });
        // console.log(this.filteredPortfolioItems);
        this.coinMarketService.setPortfolioTicker(this.filteredPortfolioItems);
        return this.filteredPortfolioItems;
      }
    });
  }

  retrieveSummaryTicker(DataProvider, Range) {
    console.log(Range);
    const marketSummaryRef = this.db.list('MarketSummary/' + DataProvider , ref => ref.limitToLast(Range))
      .valueChanges();
      marketSummaryRef.subscribe( data => {
        this.filteredSummaryItems = [];
        // console.log(data);
        data.map( tickerData => {
        this.filteredSummaryItems.push([tickerData['time'], tickerData['total_market_cap_usd']]);
      });
      // console.log(this.filteredSummaryItems);
      this.coinMarketService.setSummaryTicker(this.filteredSummaryItems);
      return this.filteredSummaryItems;
    });
  }

  storePortfolio() {
    // const token = this.authService.getToken();
    // const UserId = this.authService.getUserId();
    // return this.http.put('https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json?auth=' + token , this.coinMarketService
    const portfolioUpdate = this.coinMarketService.getPortfolioData();
    console.log(portfolioUpdate);
    const newPortfolio = {};
    this.portfolioArray = [];
    for (let object of portfolioUpdate) {
      if (object['inportfolio'] === true) {
        this.portfolioArray.push({
          symbol: object['symbol'],
          id: object['id'],
          inportfolio: true,
          balance: object['balance'],
          name: object['name'],
          value: object['y']
        }); }}
    console.log(this.userId);
    newPortfolio[this.userId] = this.portfolioArray;
    console.log('next step is saving portfolio: ' + JSON.stringify(this.portfolioArray));
    this.portfolioRef = this.db.object('UserPortfolios/');
    this.portfolioRef.update(newPortfolio);
  }
}
