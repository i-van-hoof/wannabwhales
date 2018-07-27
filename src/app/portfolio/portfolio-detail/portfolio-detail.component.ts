import {Component, OnInit} from '@angular/core';
import {CoinmarketService} from '../../home/coinmarket.service';
import {ActivatedRoute, NavigationEnd, NavigationStart, Params, Router} from '@angular/router';
// import {CoinCryptocoin} from '../../home/coinmarket.model';
import {DataStorageService} from '../../shared/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {portfolioDataModel} from '../../home/portfolio-data.model';
import {PortfolioListComponent} from '../portfolio-list/portfolio-list.component';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.css']
})
export class PortfolioDetailComponent implements OnInit {
   portfolioDataItem: portfolioDataModel;
   symbol: string;
   routeSymbol: string;
   options: Object;
   chart: Object;
   tickers: any;
   subscription: Subscription;
   filteredItems: any;

   constructor(private coinMarketservice: CoinmarketService,
               private dataStorageService: DataStorageService,
               private route: ActivatedRoute,
               private router: Router,
               ) {

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

      }

    saveInstance(chartInstance): void {
      this.chart = chartInstance;
    //  console.log(this.chart['series']);
    }

    updateSeriesData(data: any) {
      // this.chart['series'][0].setData([[1508768560076, 505.46],[1508768560085, 6505.46],[1508768627592, 100.46]]);
       this.chart['series'][0].setData(data);
    }

// de router params functie geeft de symbol van de coin in de array via het Symbol, bijv XRP.
  ngOnInit() {


    this.subscription = this.coinMarketservice.tickersChanged
      .subscribe(
        (tickers: any) => {
            this.filteredItems = [];
            tickers.map(tickerData => {
            this.filteredItems.push([tickerData['time'], tickerData['price_usd']])
            });
            console.log(this.filteredItems);
            this.chart['series'][0].setData(this.filteredItems)
        });

    this.route.params
      .subscribe(
        (params: Params) => {
          this.symbol = params['symbol'];
          console.log(this.symbol);
          this.portfolioDataItem = this.coinMarketservice.getPortfolioItem(this.symbol);

          this.dataStorageService.retrieveTicker(this.symbol).subscribe(items => {
            this.filteredItems = [];
            items.map(tickerData => {
              this.filteredItems.push([tickerData['time'], tickerData['price_usd']])
            });
            // console.log(this.filteredItems);
            this.chart['series'][0].setData(this.filteredItems)
          });
          // this.updateSeriesData();
          // this.chart['series'][0].setData(this.tickers);
          // this.filteredItems = [];
          // data.map( tickerData => {
          //   this.tickerValue = tickerData.payload.toJSON();
          //   // console.log( this.tickerValue['time'], this.tickerValue['price_usd'] );
          //   this.filteredItems.push([this.tickerValue['time'], this.tickerValue['price_usd']]);
          console.log(this.portfolioDataItem);
        }
      );
  }

  onEditPortfolioItem() {
    this.routeSymbol = this.portfolioDataItem['symbol'];
    // console.log(this.routeSymbol);
    this.router.navigate(['../', this.routeSymbol, 'edit'], {relativeTo: this.route});
  }
}
