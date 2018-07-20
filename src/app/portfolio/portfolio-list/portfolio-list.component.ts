import { Component, OnInit, OnDestroy} from '@angular/core';
import { PortfolioModel} from '../portfolio.model';
import { Subscription} from 'rxjs/Subscription';
import { CoinmarketService} from '../../home/coinmarket.service';
import { ActivatedRoute, Router} from '@angular/router';
// import { SharedService} from '../filter.service';
import 'rxjs/Rx';
import { CoinCryptocoin} from '../../home/coinmarket.model';

import {DataStorageService} from '../../shared/data-storage.service';
import { portfolioDataModel} from '../../home/portfolio-data.model';
import {marketDataModel} from '../../home/market-data.model';


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

  loading: boolean = false;
  private start: number = 0;
  active: Boolean = false;
  show1: Boolean = true;

  constructor(private coinmarketService: CoinmarketService, private dataService: DataStorageService
              ) {}


  getTotal() {
    let total = 0;
    console.log(this.marketData);
    for (let i = 0; i < this.marketData.length; i++) {
      if (this.marketData[i].value) {
        total += this.marketData[i].value;
      }
    }
    console.log(total);
    return total;
  }

  ngOnInit() {

    this.dataService.getHTTPcall('portfolio', '', 0 ,  10).then( () => this.loading = false);

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
    this.dataService.getHTTPcall('portfolio', '',  0, 50).then( () => this.loading = false);
    // this.router.navigate(['../'], {relativeTo: this.route});
  }

  // button50(portfolio: string, coin: string, start: number, limit: number) {
  //   this.loading = true;
  //   this.dataService.getHTTPcall('portfolio', '', 20, 30).then( () => this.loading = false);
  // }

  buttonPrevious(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start -= 100;
    console.log(this.start);
    this.dataService.getHTTPcall('portfolio', '', this.start, 100).then( () => this.loading = false);
  }

  buttonNext(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start += 100;
    console.log(this.start);
    this.dataService.getHTTPcall('portfolio', '', this.start, 100).then( () => this.loading = false);
  }

  // buttonAll(portfolio: string, coin: string, start: number, limit: number) {
  //   this.loading = true;
  //   this.dataService.getHTTPcall('portfolio', '', 0, 1000).then( () => this.loading = false);
  // }

}








