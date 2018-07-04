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
              public authService: AuthService) {}

              interval: number;

  onSaveData() {
    this.dataStorageService.storeMarket()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  onSavePortfolio() {
    this.dataStorageService.storePortfolio()
      // .subscribe(
      //   (response: Response) => {
      //     alert("start saving process");
      //     console.log(response);
      //   }
      // );
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
<<<<<<< HEAD
    this.dataStorageService.getUserPortfolioAuth();

    this.interval = setInterval(() =>
      this.dataStorageService.getUserPortfolioAuth(), 10000);
=======
     this.dataStorageService.getUserPortfolio2();
    this.interval = window.setInterval(() => {
      this.dataStorageService.getUserPortfolio2();
    }, 5000);
>>>>>>> 164e2de2c9699e0d7fd486846e971064824bde7e
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
