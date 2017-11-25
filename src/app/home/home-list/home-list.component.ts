import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
// import { ActivatedRoute, Router} from '@angular/router';
import { CoinCryptocoin} from '../coinmarket.model';
import { CoinmarketService} from '../coinmarket.service';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit, OnDestroy {
  coinmarket: CoinCryptocoin[];
  subscription: Subscription;

  constructor(private coinmarketService: CoinmarketService) {}


  ngOnInit() {
    this.subscription = this.coinmarketService.coinmarketChanged
      .subscribe(
        (coinmarket: CoinCryptocoin[]) => {
          this.coinmarket = coinmarket; } );
          this.coinmarket = this.coinmarketService.getMarket();
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
