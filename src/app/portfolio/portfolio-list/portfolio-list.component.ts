import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CoinmarketService } from '../../home/coinmarket.service';
import { ActivatedRoute, Router} from '@angular/router';
// import { SharedService} from '../filter.service';
import 'rxjs/Rx';

import { DataStorageService } from '../../shared/data-storage.service';
import { portfolioDataModel } from '../../home/portfolio-data.model';
import { MarketDataModel } from '../../home/market-data.model';


@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {
  marketData: MarketDataModel[];
  portfolioData: portfolioDataModel[];
  tickers: any;
  subscription1: Subscription;
  subscription2: Subscription;
  loading: boolean = false;
  private start: number = 0;
  active: Boolean = false;
  show1: Boolean = true;
  newColor = false;

  constructor(private coinmarketService: CoinmarketService, private dataService: DataStorageService
              ) {}


  // getTotal() {
  //   let total = 0;
  //   console.log(this.marketData);
  //   for (let i = 0; i < this.marketData.length; i++) {
  //     if (this.marketData[i].value) {
  //       total += this.marketData[i].value;
  //     }
  //   }
  //   console.log(total);
  //   return total;
  // }

  ngOnInit() {

    this.dataService.getMarketData( 'rank', 0 ,  30);

// this is new code for getting market data for 100s, to be mixed with portoflio

    this.subscription1 = this.coinmarketService.portfolioChanged
      .subscribe(
        (marketData: MarketDataModel[]) => {
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
    this.newColor = !this.newColor;
    this.show1 = !this.show1;
  }


  buttonCoin(coin: string) {
    this.loading = true;
    this.dataService.getHTTPcall('portfolio', coin,  0, 50).then( () => this.loading = false);
  }

  button(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.dataService.getHTTPcall('portfolio', '',  0, limit).then( () => this.loading = false);
    // this.router.navigate(['../'], {relativeTo: this.route});
  }

  buttonPrevious(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start -= 100;
    console.log(this.start);
    this.dataService.getHTTPcall('portfolio', '', this.start, 100).then( () => this.loading = false);
  }

  buttonNext(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start += 100;
    this.dataService.getHTTPcall('portfolio', '', this.start, 100).then( () => this.loading = false);
  }

}








