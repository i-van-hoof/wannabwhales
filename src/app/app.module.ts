import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent} from './header/header.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MarketComponent } from './market/market.component';
import { MarketListComponent } from './market/market-list/market-list.component';
import { MarketDetailComponent } from './market/market-detail/market-detail.component';
import { MarketItemComponent } from './market/market-list/market-item/market-item.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { WishListEditComponent } from './wish-list/wish-list-edit/wish-list-edit.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioListComponent } from './portfolio/portfolio-list/portfolio-list.component';
import { PortfolioItemComponent } from './portfolio/portfolio-list/portfolio-item/portfolio-item.component';
import { PortfolioDetailComponent } from './portfolio/portfolio-detail/portfolio-detail.component';
import { DropdownDirective} from './shared/dropdown.directive';
import { TransactionService} from './wish-list/transaction.service';
import { MarketService} from './market/market.service';
import { HttpModule} from '@angular/http';
import { AppRoutingModule} from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { DataStorageService} from './shared/data-storage.service';
import { CoinmarketService} from './home/coinmarket.service';
import { HomeListComponent } from './home/home-list/home-list.component';
import { HomeItemComponent} from './home/home-list/home-item/home-item.component';
import { TruncatePipe } from './limito.pipe';
import { JsonQuotesPipe} from './shared/replacequotes.pipe';
import { PortfolioStartComponent } from './portfolio/portfolio-start/portfolio-start.component';
import { PortfolioEditComponent } from './portfolio/portfolio-edit/portfolio-edit.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AuthService} from './auth/auth.service';

// de imports voor Firebase

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
// import { environment} from '../environments/environment';

// de imports voor Highcharts

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';

// de imports voor de grafiek van highcharts
import { ItemsListComponent } from './items/items-list/items-list.component';
import { ItemDetailComponent } from './items/item-detail/item-detail.component';
import { ItemFormComponent } from './items/item-form/item-form.component';
import {DecimalPipe} from '@angular/common';
import {AuthGuard} from './auth/auth-guard.service';


// export function highchartsFactory() {
// return highcharts;
// }
//
// export declare let require: any;

declare var require: any;

export function highchartsFactory() {
  const hc = require('highcharts');
  return hc;
}

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCxS-yQCgYUWTBDdPJFT3sIz-blK3dSSys',
    authDomain: 'whalesapp-test-mr2.firebaseapp.com',
    databaseURL: 'https://whalesapp-test-mr2.firebaseio.com',
    projectId: 'whalesapp-test-mr2',
    storageBucket: 'whalesapp-test-mr2.appspot.com',
  }
};


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MarketComponent,
    MarketListComponent,
    MarketDetailComponent,
    MarketItemComponent,
    WishListComponent,
    WishListEditComponent,
    PortfolioComponent,
    PortfolioListComponent,
    PortfolioItemComponent,
    PortfolioDetailComponent,
    DropdownDirective,
    HomeComponent,
    HomeItemComponent,
    HomeListComponent,
    TruncatePipe,
    JsonQuotesPipe,
    PortfolioStartComponent,
    PortfolioEditComponent,
    SignupComponent,
    SigninComponent,
    ItemsListComponent,
    ItemDetailComponent,
    ItemFormComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'whales-app'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    // ChartModule.forRoot(require('highcharts'))
    ChartModule

  ],
  providers: [TransactionService, MarketService, DataStorageService, CoinmarketService, AuthService, AuthGuard, PortfolioListComponent,
   {
   provide: HighchartsStatic,
   useFactory: highchartsFactory
  }
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
