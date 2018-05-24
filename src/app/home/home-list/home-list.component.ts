import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
// import { ActivatedRoute, Router} from '@angular/router';
import { CoinCryptocoin} from '../coinmarket.model';
import { CoinmarketService} from '../coinmarket.service';
import {marketDataModel} from '../market-data.model';
import {DataStorageService} from '../../shared/data-storage.service';

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

  constructor(private coinmarketService: CoinmarketService, private dataService: DataStorageService) {}



  ngOnInit() {

    this.dataService.getMarketData();

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

  clickButton() {
    this.dataService.getMarketData()
  }

}
