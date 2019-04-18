import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
// import { ActivatedRoute, Router} from '@angular/router';
import { CoinmarketService} from '../coinmarket.service';
import { DataStorageService} from '../../shared/data-storage.service';
import { MarketDataModel } from '../market-data.model';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit, OnDestroy {
  coinmarket: MarketDataModel[];
  marketData: MarketDataModel[];
  subscription: Subscription;
  subscription2: Subscription;
  loading = true;
  start: number = 0;
  active: Boolean = false;

  constructor(private coinmarketService: CoinmarketService, private dataService: DataStorageService) {}

  ngOnInit() {

    this.loading = true;
    this.dataService.getMarketData( 'rank', 0 ,  100);

    this.subscription2 = this.coinmarketService.marketDataChanged
      .subscribe(
        (marketData: MarketDataModel[]) => {
          this.marketData = marketData;
          this.loading = false; } );
  }

  ngOnDestroy() {
    this.subscription2.unsubscribe();
  }

  button(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start = 0;
    // this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
    this.dataService.getMarketData( 'rank', 0 ,  100);
  }

  buttonCoin(coin: string) {
    this.loading = true;
    // this.dataService.getHTTPcall('market', coin, 0, 20).then( () => this.loading = false);
    this.dataService.getMarketData( 'rank', 0 ,  100);
  }

  buttonPrevious(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    if (this.start > 0) { this.start -= 100; }
    // this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
    this.dataService.getMarketData( 'rank', this.start ,  100);
  }

  buttonNext(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start += 100;
    // this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false
    this.dataService.getMarketData( 'rank', this.start ,  100);

  }
}
