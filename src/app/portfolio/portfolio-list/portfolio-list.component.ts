import { Component, OnInit, OnDestroy} from '@angular/core';
import { PortfolioModel} from '../portfolio.model';
import { Subscription} from 'rxjs/Subscription';
import { CoinmarketService} from '../../home/coinmarket.service';
import { ActivatedRoute, Router} from '@angular/router';
// import { SharedService} from '../filter.service';
import 'rxjs/Rx';
import { CoinCryptocoin} from '../../home/coinmarket.model';
<<<<<<< HEAD

import {DataStorageService} from '../../shared/data-storage.service';
import { portfolioDataModel} from '../../home/portfolio-data.model';
import {marketDataModel} from '../../home/market-data.model';
=======
import { ItemsListComponent} from "../../items/items-list/items-list.component";
>>>>>>> 164e2de2c9699e0d7fd486846e971064824bde7e


@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {
  portfolio: PortfolioModel[];
  coinmarket: CoinCryptocoin[];
  marketData: marketDataModel[];
  portfolioData: portfolioDataModel[];
  tickers: any;

  subscription1: Subscription;
  subscription2: Subscription;

  private loading: boolean = false;
  private start: number = 0;
  active: Boolean = false;
  show1: Boolean = true;

<<<<<<< HEAD
  constructor(private coinmarketService: CoinmarketService, private dataService: DataStorageService
=======
  constructor(private coinmarketService: CoinmarketService, private _itemService: ItemsListComponent
>>>>>>> 164e2de2c9699e0d7fd486846e971064824bde7e
              ) {}


  getTotal() {
    let total = 0;
    for (let i = 0; i < this.marketData.length; i++) {
      if (this.marketData[i].y) {
        total += this.marketData[i].y;
      }
    }
    return total;
  }

  testing() {
    const test = this._itemService.coinmarketCap;
    console.log('testing ' +test);
  }

  ngOnInit() {

<<<<<<< HEAD
    this.dataService.getHTTPcall('portfolio','', 0 ,  10).then( () => this.loading = false);
=======



    this.subscription = this.coinmarketService.portfolioChanged
      .subscribe(
        (portfolio: PortfolioModel[]) => {
          this.portfolio = portfolio; } );
    this.portfolio = this.coinmarketService.getPortfolio();
>>>>>>> 164e2de2c9699e0d7fd486846e971064824bde7e

    // this.portfolioData = this.coinmarketService.getPortfolio();

// this is new code for getting market data for 100s, to be mixed with portoflio
    this.subscription1 = this.coinmarketService.portfolioChanged
      .subscribe(
        (marketData: marketDataModel[]) => {
            this.marketData = marketData;
          });

    this.subscription2 = this.coinmarketService.tickersChanged
          .subscribe(
      (data: any) => {
            this.portfolioData = data; } );
}

  getPortfolioDataItem(symbol: string) {
    // console.log(symbol);
    const index = this.marketData.findIndex(p => p['symbol'] === symbol);
    return this.marketData[index];
  }

  ngOnDestroy() {

    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

  show() {
    this.show1 = !this.show1;
  }



  buttonCoin(coin: string) {
    this.loading = true;
    this.dataService.getHTTPcall('portfolio', coin,  0, 20).then( () => this.loading = false);
  }

  button(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.dataService.getHTTPcall('portfolio', '',  0, 20).then( () => this.loading = false);
    // this.router.navigate(['../'], {relativeTo: this.route});
  }

  button100(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.dataService.getHTTPcall('portfolio', '', 20, 30).then( () => this.loading = false);
  }

  buttonPrevious(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start -= 100;
    this.dataService.getHTTPcall('portfolio', '', this.start, 100).then( () => this.loading = false);
  }

  buttonNext(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start += 100;
    this.dataService.getHTTPcall('portfolio', '', this.start, 100).then( () => this.loading = false);
  }

  // buttonAll(portfolio: string, coin: string, start: number, limit: number) {
  //   this.loading = true;
  //   this.dataService.getHTTPcall('portfolio', '', 0, 1000).then( () => this.loading = false);
  // }

}








