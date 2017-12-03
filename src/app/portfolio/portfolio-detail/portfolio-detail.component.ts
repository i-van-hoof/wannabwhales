import {Component, OnInit} from '@angular/core';
import {PortfolioModel} from '../portfolio.model';
import {CoinmarketService} from '../../home/coinmarket.service';
import {ActivatedRoute, NavigationEnd, NavigationStart, Params, Router} from '@angular/router';
import {CoinCryptocoin} from '../../home/coinmarket.model';
import {DataStorageService} from '../../shared/data-storage.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.css']
})
export class PortfolioDetailComponent implements OnInit {
   portfolioItem: PortfolioModel;
   coinmarketItem: CoinCryptocoin;
   symbol: string;
   routeSymbol: string;
   options: Object;
   chart: Object;
   tickers: any;
   nIntervId: any;
   subscription: Subscription;

   constructor(private coinMarketservice: CoinmarketService,
               private dataStorageService: DataStorageService,
               private route: ActivatedRoute,
               private router: Router) {

     this.options = {
       title: {text: ''},

       series: [{
         data: [ [1408768560076, 5000],[1508768560085, 5000]]
       }],
       rangeSelector: {
         enabled: true,
         buttons: [{
           type: 'day',
           count: 3,
           text: '3d'
         }, {
           type: 'week',
           count: 1,
           text: '1w'
         }, {
           type: 'month',
           count: 1,
           text: '1m'
         }, {
           type: 'month',
           count: 6,
           text: '6m'
         }, {
           type: 'year',
           count: 1,
           text: '1y'
         }, {
           type: 'all',
           text: 'All'
         }],
         selected: 3
       },
     };

     setTimeout(() => {
       // this.chart['series'][0].setData([[1508768560076, 6005.46],[1508768560085, 6505.46],
       //  [1508768627592, 7200.46]]);
        this.chart['series'][0].setData(this.tickers);
       // console.log(this.chart['series'][0].data);
     }, 100);


     router.events.subscribe((val) => {
      // console.log('router events navigationEnd');
       if (val instanceof NavigationEnd) {console.log('true');}
     });

     setInterval(() => this.updateSeriesData(this.tickers), 1000);
   }


  saveInstance(chartInstance): void {
    this.chart = chartInstance;
  //  console.log(this.chart['series']);
  }

  updateSeriesData(data: any) {
   // console.log('UpdateSeriesData()');
    // this.chart['series'][0].setData([[1508768560076, 505.46],[1508768560085, 6505.46],
    //   [1508768627592, 100.46]]);
     this.chart['series'][0].setData(data);
  }

// de router params functie geeft de symbol van de coin in de array via het Symbol, bijv XRP.
  ngOnInit() {

    this.dataStorageService.retrieveTicker(this.symbol);

    this.coinMarketservice.getTickers();

    this.subscription = this.coinMarketservice.tickersChanged
      .subscribe(
        (tickers: any) => {
          this.tickers = tickers; } );

    this.tickers = this.coinMarketservice.getTickers();


    this.route.params
      .subscribe(
        (params: Params) => {
          this.symbol = params['symbol'];
          this.portfolioItem = this.coinMarketservice.getPortfolioItem(this.symbol);
          this.coinmarketItem = this.coinMarketservice.getCoinmarketItem(this.symbol);
          this.tickers = this.dataStorageService.retrieveTicker(this.symbol);
          console.log('dit is this.route.params.this.tickers');
         // console.log(this.tickers);
          // this.updateSeriesData();
          // this.chart['series'][0].setData(this.tickers);

          // console.log('dit is this.route.params[symbol]');
          // console.log(this.symbol);
          // console.log('dit is this.portfolioItem');
          // console.log(this.portfolioItem);
          // console.log(this.coinmarketItem);
        }
      );
  }



  onEditPortfolioItem() {
    this.routeSymbol = this.coinmarketItem['symbol'];
    // console.log(this.routeSymbol);
    this.router.navigate(['../', this.routeSymbol, 'edit'], {relativeTo: this.route});

  }
}
