import {Component, ElementRef, Renderer, ViewChild} from '@angular/core';

import {Response} from '@angular/http';

import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {CoinmarketService} from '../home/coinmarket.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',

})

export class HeaderComponent {
  @ViewChild('navbarToggler') navbarToggler: ElementRef;

  constructor(private dataStorageService: DataStorageService,
              private coinmarketService: CoinmarketService,
              public authService: AuthService,
              private el: ElementRef, private renderer: Renderer, private router: Router) {
                router.events.subscribe(val => {
                  if (val instanceof NavigationEnd) {
                   console.log('end of router');
                  }
                });
              }

              interval: number;

              navBarTogglerIsVisible() {
                return this.navbarToggler.nativeElement.offsetParent !== null;
              }

              collapseNav() {
                if (this.navBarTogglerIsVisible()) {
                  this.navbarToggler.nativeElement.click();
                }
              }

  onSaveData() {
    this.dataStorageService.storeMarket()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }



  // onMenuClick() {
  //   // this.el.nativeElement.querySelector('.navbar-ex1-collapse')  get the DOM
  //       // this.renderer.setElementClass('DOM-Element', 'css-class-you-want-to-add', false) if 3rd value is true
  //       // it will add the css class. 'in' class is responsible for showing the menu.
  //       this.renderer.setElementClass(this.el.nativeElement.querySelector('navbar-ex1-collapse'), 'in', false);
  // }

  onSavePortfolio() {
    this.dataStorageService.storePortfolio();
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
    this.dataStorageService.getUserPortfolioAuth();

    this.interval = setInterval(() =>
      this.dataStorageService.getUserPortfolioAuth(), 10000);
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
