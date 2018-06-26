import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
// import { ActivatedRoute, Router} from '@angular/router';
import { CoinCryptocoin} from '../coinmarket.model';
import { CoinmarketService} from '../coinmarket.service';
<<<<<<< HEAD
import {DataStorageService} from "../../shared/data-storage.service";
=======
import {marketDataModel} from '../market-data.model';
import {DataStorageService} from '../../shared/data-storage.service';
>>>>>>> 901612b1c6110336e6fe49add0d5ad30ed5c69cc

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

<<<<<<< HEAD
  constructor(private coinmarketService: CoinmarketService, private _client: DataStorageService) {}
=======
>>>>>>> 901612b1c6110336e6fe49add0d5ad30ed5c69cc


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

  runTickerCall() {
    this._client.getUserPortfolio2();
    console.log('user portfolio called')
  }

  ngOnDestroy() {
    this.subscription2.unsubscribe();
  }
 button() {
    this.dataService.getUserPortfolioNEW();
 }
}
