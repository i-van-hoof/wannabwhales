import {Injectable} from '@angular/core';
import {Http, Response, Headers, Jsonp} from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
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
import 'rxjs/add/operator/map';
import {PortfolioEditComponent} from '../portfolio/portfolio-edit/portfolio-edit.component';
import {AngularFireAuth} from 'angularfire2/auth';
import {Item} from '../items/shared/item';
import {map} from 'rxjs/operators';
// import { constants } from 'os';



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
  itemRef: AngularFireObject<any>;
  itemRef2: AngularFireObject<any>;
  // Firebase reference for market info
  marketRef: any;

  portfolioRef: AngularFireObject<any>;
  item: Observable<any>;
  items: FirebaseListObservable<Item[]> = null;
  testArray = [];
  portfolio = [];
  portfolio2 = [];
  portfolioSummary = {};
  portfolioArray = [];
  coin: string;
  maxChange: number;
  maxChangeSymbol: string;
  minChange = 0;
  minChangeSymbol: string;
  apiRoot = 'https://api.coinmarketcap.com/v1/ticker/';
  apiRootCors = 'https://api.coinmarketcap.com/v1/ticker';
  // apiRootCors = 'https://cors-anywhere.herokuapp.com/https://api.coinmarketcap.com/v1/ticker';
  results = [];
  loading: boolean;

  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  constructor(private http: Http,
              private coinMarketService: CoinmarketService,
              private transactionService: TransactionService,
              private authService: AuthService,
              public  db: AngularFireDatabase,
              private af: AngularFireAuth,
              private jsonp: Jsonp
              ) {
                    this.user = af.authState;
                    this.af.authState.subscribe(user => {
                      if (user) { this.userId = user.uid; }
                    });
                    this.results = [];
                    this.loading = false;
                  }
  getMarketData() {
    return this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=100').map((res: Response) => res.json()).subscribe( data => {
      for (let object of data) {
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
      if (this.authService.editMode === false) {
        // console.log(data);
        this.coinMarketService.setMarketData(data);
      } else { console.log('is in Edit Mode')}
    });
  }

  getUserPortfolioAuth() {
    this.af.authState.first().toPromise().then
    (user => {if (user) {this.getUserPortfolioNEW(); console.log('auth worked'); } }); }
// (user => {if(user) console.log('fetching data of: '+user.uid); this.getUserPortfolioNEW()  });}

  getUserPortfolioNEW() {
    this.maxChange = 0;
    this.portfolio2 = [];
    this.portfolioSummary = {};
    this.itemRef2 = this.db.object(`UserPortfolios/${this.userId}`);
    // method with Promise
    this.itemRef2
      .snapshotChanges()
      .map(res => { this.portfolio2 = res.payload.val(); })
      .first()
      .toPromise().then(() =>
      // this.setData(this.portfolio2);
      this.firebaseQuery(this.portfolio2))
      .catch(result => console.log('Promise not working', result));
  }

  // setData(portfolio) {
  //   console.log(portfolio);
  //     for (let coinItem of portfolio) {
  //       this.coin = coinItem['id'];
  //       const url = 'https://api.coinmarketcap.com/v1/ticker/' + this.coin;
  //       console.log(url);
  //     this.http.get('https://api.coinmarketcap.com/v1/ticker/' + this.coin).map((res: Response) => res.json()).subscribe(data => {
  //         console.log(data);
  //         for (let object of data) {
  //           coinItem['y'] = coinItem['balance'] * object['price_usd'];
  //           coinItem['rank'] = +object['rank'];
  //           coinItem['price_usd'] = +object['price_usd'];
  //           coinItem['price_btc'] = +object['price_btc'];
  //           coinItem['volume_24h'] = +object['24h_volume_usd'];
  //           coinItem['market_cap_usd'] = +object['market_cap_usd'];
  //           coinItem['available_supply'] = +object['available_supply'];
  //           coinItem['total_supply'] = +object['total_supply'];
  //           coinItem['max_supply'] = +object['max_supply'];
  //           coinItem['percent_change_1h'] = +object['percent_change_1h'];
  //           coinItem['percent_change_24h'] = +object['percent_change_24h'];
  //           coinItem['percent_change_7d'] = +object['percent_change_7d'];
  //           coinItem['last_updated'] = +object['last_updated'];
  //           delete object['24h_volume_usd'];
  //         }
  //       }, error => {console.log('error getting coinmarket coin info: ' + error); });
  //     }
  //     // console.log(portfolio);
  //     this.coinMarketService.setPortfolioData(portfolio);
  //     // this.coinMarketService.setPortfolio(portfolio);
  //   }

    firebaseQuery(portfolio) {
      const coinsToFetch = [];
      for (const coinItem of portfolio) {
        coinsToFetch.push(coinItem['symbol']); }
        console.log('Fetched coins from UserPortfolio in Firebase: ' + coinsToFetch);

      // Map the Firebase promises into an array
      const coinPromises = coinsToFetch.map(id => {
        return this.db.object('market/' + id).valueChanges().first().toPromise();
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
    }

// testing
  // getUserPortfolioNEW() {
  //   this.af.authState.toPromise().then
  //   (user => {if(user) this.userId = user.uid; console.log(this.userId) });
  //   if (!this.userId) return;
  //   console.log(this.userId);
  //   let total = 0;
  //   this.portfolio = [];
  //   this.itemRef = this.db.object(`UserPortfolios/${this.userId}`);
  //   this.itemRef.snapshotChanges().subscribe(action => {
  //     if (action.payload.val()) {this.portfolio = action.payload.val()} else {this.portfolio = []}
  //     for (let object of this.portfolio) {
  //       return this.http.get('https://api.coinmarketcap.com/v1/ticker/' + object['id']).map((res: Response) => res.json()).subscribe( data => {
  //         console.log(data)
  //       })}})}

  //         const portfolioIndex = this.portfolio.findIndex(p => p.symbol === object.symbol);
  //         object['price_usd'] = +object['price_usd'];
  //         if (portfolioIndex >= 0) {object['balance'] = this.portfolio[portfolioIndex].balance; object['value'] = this.portfolio[portfolioIndex].balance * object['price_usd'] ; total += object['value'];} else {object['balance'] = 0; object['value'] =0 }
  //         if (portfolioIndex >= 0) {object['inportfolio'] = this.portfolio[portfolioIndex].inportfolio; } else {object['inportfolio'] = false; }
  //         object['volume_24h'] = object['24h_volume_usd'];
  //         object['volume_24h'] = +object['volume_24h'];
  //         object['last_updated'] = +object['last_updated'];
  //         object['market_cap_usd'] = +object['market_cap_usd'];
  //         object['price_btc'] = +object['price_btc'];
  //         object['price_usd'] = +object['price_usd'];
  //         object['percent_change_1h'] = +object['percent_change_1h'];
  //         object['percent_change_24h'] = +object['percent_change_24h'];
  //         object['percent_change_7d'] = +object['percent_change_7d'];
  //         object['available_supply'] = +object['available_supply'];
  //         object['total_supply'] = +object['total_supply'];
  //         object['last_updated'] = +object['last_updated'];
  //         delete object['24h_volume_usd'];
  //       }
  //       // console.log(total);
  //       data.push({id: 'Portfolio_UsID', name: 'Portfolio1', symbol: 'PORTF', rank: '1000', price_usd: total, price_btc
  //           : 1, balance: 1
  //       });
  //       if (this.authService.editMode === false) {
  //         console.log(data);
  //         this.coinMarketService.setCoinmarket(data);
  //         this.coinMarketService.setPortfolio(data);
  //       } else { console.log('is in Edit Mode')}
  //     });
  //
  //
  //   });
  //
  // }

  // getUserPortfolio2() {
  //   this.af.authState.first().toPromise().then
  //   (user => {if(user) console.log(user.uid); this.getUserPortfolio()  });}

  // getUserPortfolio() {
  // // if (!this.userId) return;
  // console.log('fetching userPortfolio for ' + this.userId);
  // let total = 0;
  // this.portfolio = [];
  // this.itemRef = this.db.object(`UserPortfolios/${this.userId}`);
  // this.itemRef.snapshotChanges().subscribe(action => {
  //   if (action.payload.val()) {this.portfolio = action.payload.val()} else {this.portfolio = []}
  //  // if (this.portfolio = null) { this.portfolio = [] }
  //   console.log(this.portfolio);
  //   return this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=275').map((res: Response) => res.json()).subscribe( data => {
  //     // console.log(data);
  //     for (let object of data) {
  //       const portfolioIndex = this.portfolio.findIndex(p => p.symbol === object.symbol);
  //       // console.log(portfolioIndex);
  //       object['price_usd'] = +object['price_usd'];
  //       if (portfolioIndex >= 0) {
  //         object['balance'] = this.portfolio[portfolioIndex].balance;
  //         object['value'] = this.portfolio[portfolioIndex].balance * object['price_usd'] ;
  //         total += object['value'];} else {object['balance'] = 0; object['value'] =0 }
  //       if (portfolioIndex >= 0) {
  //         object['inportfolio'] = this.portfolio[portfolioIndex].inportfolio; }
  //         else {object['inportfolio'] = false; }
  //       object['volume_24h'] = object['24h_volume_usd'];
  //       object['volume_24h'] = +object['volume_24h'];
  //       object['last_updated'] = +object['last_updated'];
  //       object['market_cap_usd'] = +object['market_cap_usd'];
  //       object['price_btc'] = +object['price_btc'];
  //       object['price_usd'] = +object['price_usd'];
  //       object['percent_change_1h'] = +object['percent_change_1h'];
  //       object['percent_change_24h'] = +object['percent_change_24h'];
  //       object['percent_change_7d'] = +object['percent_change_7d'];
  //       object['available_supply'] = +object['available_supply'];
  //       object['total_supply'] = +object['total_supply'];
  //       object['last_updated'] = +object['last_updated'];
  //       delete object['24h_volume_usd'];
  //     }
  //     // console.log(total);
  //     data.push({id: 'Portfolio_UsID', percent_change_24h: 0, name: 'Portfolio1', symbol: 'PORTF', rank: '1000', price_usd: total, price_btc
  //         : 1, balance: 1
  //     });
  //     if (this.authService.editMode === false) {
  //       // console.log(data);
  //       this.coinMarketService.setCoinmarket(data);
  //       this.coinMarketService.setPortfolio(data);
  //     } else { console.log('is in Edit Mode')}
  //   });

  // voorbeeld code http headers
  // https://cors-anywhere.herokuapp.com/https://api.coinmarketcap.com/v2/ticker/1/


// return this.http.get(this.heroesUrl, requestOptions)

// let headers = new Headers();
// headers.append('Content-Type', 'application/json');
// headers.append('authentication', `${student.token}`);

// let options = new RequestOptions({ headers: headers });


  testHTTPcall(type: string, coin: string, start: number,  limit: number) {
    // const requestOptions = {
    //   headers: new Headers(this.headerDict),
    // };
      const apiURL = `${this.apiRootCors}/?callback=foo`;
      // test
      console.log(apiURL);
      this.http.get(apiURL).subscribe(data => console.log(data));
    }

  getHTTPcall(type: string, coin: string, start: number,  limit: number) {
    let promise = new Promise((resolve, reject) => {
      let apiURL = `${this.apiRoot}${coin}/?start=${start}&limit=${limit}`;
      console.log(apiURL);
      this.http.get(apiURL)
        .toPromise()
        .then(
          res => { // Success
            console.log('data received from coinmarketcap');
            this.results = res.json();
            for (let object of this.results) {
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
              console.log('setMarketData() from datastorage')
              this.coinMarketService.setMarketData(this.results);
            } else {
              console.log('setportfolio from datastorage');
              this.coinMarketService.setPortfolio(this.results);
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
  };

  retrievePortfolioTicker(Range) {

     if (!this.userId) return;
      const items = this.db.list(`PortfolioTickers/${this.userId}` , ref => ref.limitToLast(Range)).valueChanges();
      items.subscribe( data => {
      if (data) {
        // console.log('there is ticker data');
        this.filteredPortfolioItems = [];
        data.map(tickerData => {
          // this.portfolioTickerValue = tickerData.payload.toJSON();
          // console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
          this.filteredPortfolioItems.push([tickerData['time'], tickerData['price_usd']]);
        });
        // console.log(this.filteredPortfolioItems);
        this.coinMarketService.setPortfolioTicker(this.filteredPortfolioItems);
        return this.filteredPortfolioItems;
      }
    })
  };

  retrieveSummaryTicker(DataProvider, Range) {
    console.log(Range);
    const itemsRef = this.db.list('MarketSummary/' + DataProvider , ref => ref.limitToLast(Range))
      .valueChanges();
      itemsRef.subscribe( data => {
        this.filteredSummaryItems = [];
        // console.log(data);
        data.map( tickerData => {
        this.filteredSummaryItems.push([tickerData['time'], tickerData['total_market_cap_usd']]);
      });
      // console.log(this.filteredSummaryItems);
      this.coinMarketService.setSummaryTicker(this.filteredSummaryItems);
      return this.filteredSummaryItems;
    })
  };

   //  if (this.authService.isAuthenticated()) {
   //    const UserId = this.authService.getUserId();
   //   console.log("getting portfolio ticker from firebase");
   //   const itemsRef = this.db.list('PortfolioTickers/' + UserId).snapshotChanges();

    // new code to be completed!!!
    //  if (!this.userId) return;
    //  // const items = this.db.list(`PortfolioTickers/${this.userId}`).snapshotChanges();
    // const items = this.db.list(`PortfolioTickers/${this.userId}` , ref => ref.limitToLast(Range))
    //   .valueChanges();
    //     items.subscribe( data => {
    //     if (data) {
    //       // console.log('there is ticker data');
    //       this.filteredPortfolioItems = [];
    //       data.map(tickerData => {
    //         // this.portfolioTickerValue = tickerData.payload.toJSON();
    //         // console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
    //         this.filteredPortfolioItems.push([tickerData['time'], tickerData['price_usd']]);
    //       });
    //       // console.log(this.filteredPortfolioItems);
    //       this.coinMarketService.setPortfolioTicker(this.filteredPortfolioItems);
    //       return this.filteredPortfolioItems;
    //     }
    //   })
  //   } else {
  //     console.log('user not authenticated')
  //   }
//  };


  storePortfolio() {
    // const token = this.authService.getToken();
    // const UserId = this.authService.getUserId();
    // return this.http.put('https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json?auth=' + token , this.coinMarketService

    const updates2 = this.coinMarketService.getPortfolioData();
    console.log(updates2);

    const newPortfolio = {};
    this.portfolioArray = [];
    for (let object of updates2) {
        this.portfolioArray.push({
          symbol: object['symbol'],
          id: object['id'],
          inportfolio: true,
          balance: object['balance'],
          name: object['name'],
          value: object['value']
        });}

    console.log(this.userId);
    console.log(this.portfolioArray);
    newPortfolio[this.userId] = this.portfolioArray;
    console.log("next step is saving portfolio");
    console.log(newPortfolio);
    this.portfolioRef = this.db.object('UserPortfolios/');
    this.portfolioRef.update(newPortfolio);

// old code

    // this.portfolioArray = [];
    //  for (let object of updates2) {
    //    if( object['inportfolio'] == true) {
    //     this.portfolioArray.push({
    //       symbol: object['symbol'],
    //       id: object['id'],
    //       inportfolio: true,
    //       balance: object['balance'],
    //       name: object['name'],
    //       value: object['value']
    //     });}
    //     }
    //     console.log(this.userId);
    //     console.log(this.portfolioArray);
    //     console.log("saving portfolio");
    //  this.portfolioRef = this.db.object(`UserPortfolios/${this.userId}`);
    //  this.portfolioRef.set(this.portfolioArray).then(console.log("worked"));

  }

  storeTransactions() {
    const token = this.authService.getToken();
    return this.http.put('https://whales-app.firebaseio.com/transactions.json?auth=' + token, this.transactionService
      .getTransactions());
  }

  // getUserPortfolioOUD() {
  //       if (this.authService.isAuthenticated()) {
  //         console.log('Authenticated: Start fetching portfolio data');
  //         // const token = this.authService.getToken();
  //         const UserId = this.authService.getUserId();
  //         // alert(UserId);
  //          // this.userLogedIn = 'https://whalesapp-test-mr2.firebaseio.com/UserPortfolios/76ZrXBfRFUNj5mWDrtMkZa9b6Np1.json?auth=' + token;
  //          this.userLogedIn = 'https://whalesapp-test-mr2.firebaseio.com/UserPortfolios/'+ UserId+ '.json';
  //         // this.userLogedIn = 'https://whalesapp-dev.firebaseio.com/UserPortfolios/' + UserId + '.json';
  //         console.log('logged in and fetching data from location:', this.userLogedIn);
  //         } else {
  //         this.userLogedIn = 'https://whalesapp-dev.firebaseio.com/UserPortfolios/Akg620apdUMJSgTowufZe7QHGCo1.json'
  //           }
  //
  //     return Observable.forkJoin(
  //
  //     this.http.get(this.userLogedIn)
  //       .map((res: Response) => res.json()),
  //      // console.log(this.items);
  //
  //     this.http.get('https://api.coinmarketcap.com/v1/ticker/?limit=275')
  //       .map((res: Response) => res.json())
  //     )
  //       .subscribe( (Observable) => {
  //            console.log(Observable[0]);
  //           // console.log(Observable[1]);
  //         let total = 0;
  //         for (let object of Observable[1]) {
  //         const index3 = Observable[0].findIndex(p => p.symbol === object.symbol);
  //           object['price_usd'] = +object['price_usd'];
  //           if (index3 >= 0) {object['balance'] = Observable[0][index3].balance; object['value'] = Observable[0][index3].balance * object['price_usd'] ; total += object['value'];} else {object['balance'] = 0; }
  //           if (index3 >= 0) {object['inportfolio'] = Observable[0][index3].inportfolio; } else {object['inportfolio'] = false; }
  //           object['volume_24h'] = object['24h_volume_usd'];
  //           object['volume_24h'] = +object['volume_24h'];
  //           object['last_updated'] = +object['last_updated'];
  //           object['market_cap_usd'] = +object['market_cap_usd'];
  //           object['price_btc'] = +object['price_btc'];
  //           object['price_usd'] = +object['price_usd'];
  //           object['percent_change_1h'] = +object['percent_change_1h'];
  //           object['percent_change_24h'] = +object['percent_change_24h'];
  //           object['percent_change_7d'] = +object['percent_change_7d'];
  //           object['available_supply'] = +object['available_supply'];
  //           object['total_supply'] = +object['total_supply'];
  //           object['last_updated'] = +object['last_updated'];
  //           delete object['24h_volume_usd'];
  //
  //           // console.log('total portfolio value');
  //           // console.log(total);
  //         }
  //          //  console.log(total);
  //           Observable[1].push({id: 'Portfolio_UsID', name: 'Portfolio1', symbol: 'PORTF', rank: '1000', price_usd: total, price_btc
  //             : 1, balance: 1
  //              });
  //             // console.log(this.portfolioEditComponent.editMode);
  //           if (this.authService.editMode === false) {
  //             this.coinMarketService.setCoinmarket(Observable[1]);
  //             this.coinMarketService.setPortfolio(Observable[1]);
  //           } else { console.log('is in Edit Mode')}
  //
  //     }) ;
  //   }

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

