import {Component} from '@angular/core';

import {Response} from '@angular/http';

import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {CoinmarketService} from '../home/coinmarket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',

})

export class HeaderComponent {
  constructor(private dataStorageService: DataStorageService,
              private coinmarketService: CoinmarketService,
              private authService: AuthService) {}

              interval: number;

  onSaveData() {
    this.dataStorageService.storeMarket()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  onSaveTicker1() {
    this.dataStorageService.storeTicker99();
  }

  onSaveTicker2() {
    this.dataStorageService.storeTicker199();
  }

  onSaveTicker3() {
    this.dataStorageService.storeTicker299();
  }


  onSavePortfolio() {
    this.dataStorageService.storePortfolio()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  onSaveTransactions() {
    this.dataStorageService.storeTransactions()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  ngOnInit() {
    this.interval = window.setInterval(() => {
      this.onGetPortfolio();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onGetPortfolio() {
    this.dataStorageService.getBooksAndMovies();
  }

  onGetTransactions() {
    this.dataStorageService.getServerTransactions();
  }


}
