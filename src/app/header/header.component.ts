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

  // test code for Databsae read
  retrieveUserPortfolio() {
    this.dataStorageService.retrieveTest();};

  onSavePortfolio() {
    this.dataStorageService.storePortfolio()
      .subscribe(
        (response: Response) => {
          alert("start saving process");
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

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.dataStorageService.getUserPortfolio();
    this.interval = window.setInterval(() => {
      this.dataStorageService.getUserPortfolio();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onGetTransactions() {
    this.dataStorageService.getServerTransactions();
  }


}
