import { Component, OnInit, OnDestroy} from '@angular/core';
import { PortfolioModel} from '../portfolio.model';
import { Subscription} from 'rxjs/Subscription';
import { CoinmarketService} from '../../home/coinmarket.service';
import { ActivatedRoute, Router} from '@angular/router';
// import { SharedService} from '../filter.service';
import 'rxjs/Rx';
import { CoinCryptocoin} from '../../home/coinmarket.model';
import { ItemsListComponent} from "../../items/items-list/items-list.component";


@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.css']
})
export class PortfolioListComponent implements OnInit, OnDestroy {
  portfolio: PortfolioModel[];
  coinmarket: CoinCryptocoin[];
  tickers: any;
  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  active: Boolean = false;
  show1: Boolean = true;

  constructor(private coinmarketService: CoinmarketService, private _itemService: ItemsListComponent
              ) {}


  getTotal() {
    let total = 0;
    for (let i = 0; i < this.coinmarket.length; i++) {
      if (this.coinmarket[i].value) {
        total += this.coinmarket[i].value;
      }
    }
    return total;
  }

  testing() {
    const test = this._itemService.coinmarketCap;
    console.log('testing ' +test);
  }

  ngOnInit() {




    this.subscription = this.coinmarketService.portfolioChanged
      .subscribe(
        (portfolio: PortfolioModel[]) => {
          this.portfolio = portfolio; } );
          this.portfolio = this.coinmarketService.getPortfolio();

   //  code om de coinmarket data op te halen uit de coinmarket service
    this.subscription2 = this.coinmarketService.coinmarketChanged
      .subscribe(
        (coinmarket: CoinCryptocoin[]) => {
          this.coinmarket = coinmarket; } );
          this.coinmarket = this.coinmarketService.getMarket();

    this.subscription3 = this.coinmarketService.tickersChanged
      .subscribe(
        (tickers: any) => {
          this.tickers = tickers; } );
          this.tickers = this.coinmarketService.getTickers();
       }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  show() {
    this.show1 = !this.show1;
  }

  // useFilter() {
   // this.ss.change();
   // this.active = !this.active;
   // this.portfolio = this.coinmarketService.getPortfolio();
  // }

}








