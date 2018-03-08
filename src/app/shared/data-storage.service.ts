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
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database-deprecated';
// import Database = firebase.database.Database;
import 'rxjs/add/operator/map';
import {PortfolioEditComponent} from '../portfolio/portfolio-edit/portfolio-edit.component';
import { AngularFireAuth } from 'angularfire2/auth';
import {Item} from '../items/shared/item';


@Injectable()
export class DataStorageService {
 filteredItems = [];

 userLogedIn: any;
 filteredSummaryItems = [];
 filteredtestArray = [];
 filteredPortfolioItems = [];
 tickerValue = {};
 summaryTickerValue = {};
 portfolioTickerValue = {};

  userId: string;

  user: Observable<firebase.User>;

  itemRef: AngularFireObject<any>;
  portfolioRef: AngularFireObject<any>;
  item: Observable<any>;

  //test code
  items: FirebaseListObservable<Item[]> = null;
  testArray = [];
  portfolio = [];
  portfolioArray = [];


  constructor(private http: Http,
              private coinMarketService: CoinmarketService,
              private transactionService: TransactionService,
              private authService: AuthService,
              public  db: AngularFireDatabase,
              private af: AngularFireAuth,
              )
                  {
                    this.itemRef = db.object('UserPortfolios');
                    this.item = this.itemRef.valueChanges();
                    this.user = af.authState;
                    this.af.authState.subscribe(user => {
                      if(user) this.userId = user.uid
                    })
                  }

  getUserPortfolio() {
  if (!this.userId) return;
  console.log(this.userId);
  let total = 0;
  this.portfolio = [];
  this.itemRef = this.db.object(`UserPortfolios/${this.userId}`);
  this.itemRef.snapshotChanges().subscribe(action => {
    if (action.payload.val()) {this.portfolio = action.payload.val()} else {this.portfolio = []};
   // if (this.portfolio = null) { this.portfolio = [] }
    return this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=275').map((res: Response) => res.json()).subscribe( data => {
      // console.log(data);
      for (let object of data) {
        const portfolioIndex = this.portfolio.findIndex(p => p.symbol === object.symbol);
        // console.log(portfolioIndex);
        object['price_usd'] = +object['price_usd'];
        if (portfolioIndex >= 0) {object['balance'] = this.portfolio[portfolioIndex].balance; object['value'] = this.portfolio[portfolioIndex].balance * object['price_usd'] ; total += object['value'];} else {object['balance'] = 0; }
        if (portfolioIndex >= 0) {object['inportfolio'] = this.portfolio[portfolioIndex].inportfolio; } else {object['inportfolio'] = false; }
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
      // console.log(total);
      data.push({id: 'Portfolio_UsID', name: 'Portfolio1', symbol: 'PORTF', rank: '1000', price_usd: total, price_btc
          : 1, balance: 1
      });
      if (this.authService.editMode === false) {
        console.log(data);
        this.coinMarketService.setCoinmarket(data);
        this.coinMarketService.setPortfolio(data);
      } else { console.log('is in Edit Mode')}
    });


  });

 }

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

  retrievePortfolioTicker() {
   //  if (this.authService.isAuthenticated()) {
   //    const UserId = this.authService.getUserId();
   //   console.log("getting portfolio ticker from firebase");
   //   const itemsRef = this.db.list('PortfolioTickers/' + UserId).snapshotChanges();

    // new code
     if (!this.userId) return;
     const items = this.db.list(`PortfolioTickers/${this.userId}`).snapshotChanges();
    // old code
      items.subscribe(data => {
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
  //   } else {
  //     console.log('user not authenticated')
  //   }
 };

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

  storePortfolio() {
    // const token = this.authService.getToken();
   // const UserId = this.authService.getUserId();
    // return this.http.put('https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json?auth=' + token , this.coinMarketService

    const updates2 = this.coinMarketService.getPortfolio();
    console.log(updates2);
    //code for testing leaner portoflio database child
    this.portfolioArray = [];
     for (let object of updates2) {
       if( object['inportfolio'] == true) {
        this.portfolioArray.push({
          symbol: object['symbol'],
          id: object['id'],
          inportfolio: true,
          balance: object['balance'],
          name: object['name'],
          value: object['value']
          // rank: object['rank'],
          // price_usd: object['price_usd'],
          // price_btc: object['price_btc']
        });}
        }
    console.log(this.portfolioArray);
     this.portfolioRef = this.db.object(`UserPortfolios/${this.userId}`);
      this.portfolioRef.set(this.portfolioArray);
    //  return this.http.put('https://whalesapp-test-mr2.firebaseio.com/UserPortfolios/' + UserId + '.json' , this.coinMarketService
    //    .getPortfolio());
  }

  storeTransactions() {
    const token = this.authService.getToken();
    return this.http.put('https://whales-app.firebaseio.com/transactions.json?auth=' + token, this.transactionService
      .getTransactions());
  }

  getUserPortfolioOUD() {
        if (this.authService.isAuthenticated()) {
          console.log('Authenticated: Start fetching portfolio data');
          // const token = this.authService.getToken();
          const UserId = this.authService.getUserId();
          // alert(UserId);
           // this.userLogedIn = 'https://whalesapp-test-mr2.firebaseio.com/UserPortfolios/76ZrXBfRFUNj5mWDrtMkZa9b6Np1.json?auth=' + token;
           this.userLogedIn = 'https://whalesapp-test-mr2.firebaseio.com/UserPortfolios/'+ UserId+ '.json';
          // this.userLogedIn = 'https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json';
          console.log('logged in and fetching data from location:', this.userLogedIn);
          } else {
          this.userLogedIn = 'https://whalesapp-dev.firebaseio.com/UserPortfolios/Akg620apdUMJSgTowufZe7QHGCo1.json'
            }


      return Observable.forkJoin(

      this.http.get(this.userLogedIn)
        .map((res: Response) => res.json()),
       // console.log(this.items);

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

  storeMarket() {
    return this.http.put('https://whales-app.firebaseio.com/market.json', this.coinMarketService
      .getMarket());
  }
}

