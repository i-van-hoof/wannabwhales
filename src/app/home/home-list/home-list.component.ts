import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
// import { ActivatedRoute, Router} from '@angular/router';
import { CoinCryptocoin} from '../coinmarket.model';
import { CoinmarketService} from '../coinmarket.service';
import { DataStorageService} from "../../shared/data-storage.service";
import { marketDataModel } from '../market-data.model';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit, OnDestroy {
  coinmarket: CoinCryptocoin[];
  marketData: marketDataModel[];
  subscription: Subscription;
  subscription2: Subscription;
  loading = false;
  start: number = 0;
  active: Boolean = false;

  constructor(private coinmarketService: CoinmarketService, private dataService: DataStorageService) {}




  ngOnInit() {

    this.loading = true;
    this.dataService.getHTTPcall('market', '', 0 ,  100).then( () => this.loading = false);

    // this.subscription = this.coinmarketService.coinmarketChanged
    //   .subscribe(
    //     (coinmarket: CoinCryptocoin[]) => {
    //       this.coinmarket = coinmarket; } );
    //       // this.coinmarket = this.coinmarketService.getMarket();

    this.subscription2 = this.coinmarketService.marketDataChanged
      .subscribe(
        (marketData: marketDataModel[]) => {
          this.marketData = marketData; } );
    // this.coinmarket = this.coinmarketService.getMarket();
  }


  ngOnDestroy() {
    this.subscription2.unsubscribe();
  }

  test() {
    console.log('test starting');
    // this.dataService.testFirebaseQuery();
    this.dataService.getUserPortfolioAuth();
  }


 button(portfolio: string, coin: string, start: number, limit: number) {
   this.loading = true;
   this.start = 0;
   this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
 }

 buttonCoin(coin: string) {
  this.loading = true;
  this.dataService.getHTTPcall('market', coin,  0, 20).then( () => this.loading = false);
}

  // button100(portfolio: string, coin: string, start: number, limit: number) {
  //   this.loading = true;
  //   this.start = 100;
  //   this.dataService.getHTTPcall('market', '', this.start, 200).then( () => this.loading = false);
  // }

  // button200(portfolio: string, coin: string, start: number, limit: number) {
  //   this.loading = true;
  //   this.start = 200;
  //   this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
  // }

  buttonPrevious(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start -= 100;
    this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
  }

  buttonNext(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start += 100;
    this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
  }
}
