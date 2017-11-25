import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import { ChartModule } from 'angular2-highcharts';
import {DataStorageService} from '../../shared/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {CoinmarketService} from '../../home/coinmarket.service';


@Component({
  selector: 'app-items-list',
  // template: `<chart [options]="options"></chart>`,
   templateUrl: './items-list.component.html',
     //template: `<chart [options]="options" (load)="saveInstance($event.context)"></chart>`,


  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  options: Object;
  items: Observable<any[]>;
  data: any;
  subscription: Subscription;
  tickers: any;
  chart: Object;

  constructor(
    db: AngularFireDatabase,
    private dataStorageService: DataStorageService,
    private coinmarketService: CoinmarketService
  ) {
     this.items = db.list('Tickers').valueChanges();
     console.log(this.items);
    }

  saveInstance(chartInstance): void {
    this.chart = chartInstance;
    console.log(this.chart['series']);
  }

  updateSeriesData(data: Array<any>) {
   // console.log('button UpdateSeriesData()');
    this.chart['series'][0].setData(this.tickers);
  }



  ngOnInit() {

    // this.dataStorageService.retrieveTicker();
    this.coinmarketService.getTickers();
    //console.log(this.tickers);

    this.subscription = this.coinmarketService.tickersChanged
      .subscribe(
        (tickers: any) => {
          this.tickers = tickers; } );
          this.tickers = this.coinmarketService.getTickers();
          // console.log(this.tickers);

  }

}
