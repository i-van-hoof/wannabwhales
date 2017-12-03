import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import { ChartModule } from 'angular2-highcharts';
import {DataStorageService} from '../../shared/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {CoinmarketService} from '../../home/coinmarket.service';
import {CoinCryptocoin} from '../../home/coinmarket.model';


@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  optionsStockchart: Object;
  optionsPiechart: Object;
  items: Observable<any[]>;
  data: any;
  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  tickers: any;
  portfolioTickers: any;
  summaryTickers: any;
  chartStock: Object;
  chartPie: Object;
  chartSummary: Object;
  coinmarket: CoinCryptocoin[];
  sharesArray = [];
  filteredSummaryItems;

  constructor(
    db: AngularFireDatabase,
    private dataStorageService: DataStorageService,
    private coinmarketService: CoinmarketService
  ) {

    // options of the Highstock ticker
    this.optionsStockchart = {
      title: {text: ''},
      rangeSelector: {
        buttonTheme: {
          fill: '#505053',
          stroke: '#000000',
          style: {
            color: '#CCC'
          },
          states: {
            hover: {
              fill: '#707073',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            },
            select: {
              fill: '#000003',
              stroke: '#000000',
              style: {
                color: 'white'
              }
            }
          }
        },
        inputBoxBorderColor: '#505053',
        inputStyle: {
          backgroundColor: '#333',
          color: 'silver'
        },
        labelStyle: {
          color: 'silver'
        }
      },

      navigation: {
        buttonOptions: {
          symbolStroke: '#DDDDDD',
          theme: {
            fill: '#505053'
          }
        }
      },
      navigator: {
        handles: {
          backgroundColor: '#666',
          borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
          color: '#7798BF',
          lineColor: '#A6C7ED'
        },
        xAxis: {
          gridLineColor: '#505053'
        }
      },

      scrollbar: {
        barBackgroundColor: '#808083',
        barBorderColor: '#808083',
        buttonArrowColor: '#CCC',
        buttonBackgroundColor: '#606063',
        buttonBorderColor: '#606063',
        rifleColor: '#FFF',
        trackBackgroundColor: '#404043',
        trackBorderColor: '#404043'
      },

      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        backgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 0},
          stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
          ]
        }
      },
      xAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
          style: {
            color: '#A0A0A3'

          }
        }
      },
      yAxis: {
        gridLineColor: '#707073',
        labels: {
          style: {
            color: '#E0E0E3'
          }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
          style: {
            color: '#A0A0A3'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
          color: '#F0F0F0'
        }
      },
      plotOptions: {
        series: {
          dataLabels: {
            color: '#B0B0B3'
          },
          marker: {
            lineColor: '#333'
          }
        },
        boxplot: {
          fillColor: '#505053'
        },
        candlestick: {
          lineColor: 'white'
        },
        errorbar: {
          color: 'white'
        }
      },
      series: [{
        data: [[1508768560076, 0], [1508768560085, 0]]
      }],
    };
    // options of the piechart Highcharts
    this.optionsPiechart = {
      title: {text: ''},
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        type: 'pie',
        backgroundColor: '#2a2a2b',

        plotBackgroundColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 0},
          stops: [
            [0, '#2a2a2b'],
            [1, '#3e3e40']
          ]
        },
        plotBorderWidth: null,
        plotShadow: false,
      },
      //     legend: { enabled: false },
      credits: {enabled: false},
      tooltip: {
        //     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            style: {
              color: '#E0E0E3',
              textTransform: 'uppercase'
            },
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          }
        }
      },
      series: [{
        name: 'Portfolio Weight',
        data: [{
          name: 'BTC',
          y: 30.33
        }, {
          name: 'ETH',
          y: 20.03,
        }, {
          name: 'BTH',
          y: 10.38
        }, {
          name: 'NEO',
          y: 4.77
        }, {
          name: 'QRL',
          y: 5.91
        }, {
          name: 'BURST',
          y: 8.2
        }]
      }]
    };


    this.items = db.list('PortfolioTickers').valueChanges();
    console.log(this.items);

    //   setTimeout(() => {
    //     this.chartStock['series'][0].setData(this.portfolioTickers);
    //     // this.getPiechartData();
    //     // console.log(this.sharesArray);
    //    // this.chartPie['series'][0].setData(this.sharesArray);
    //   }, 1000);
  }

  saveInstanceStock(chartInstance): void {
    this.chartStock = chartInstance;
  }

  saveInstancePie(chartInstance): void {
    this.chartPie = chartInstance;
  }

  saveInstanceSummary(chartInstance): void {
    this.chartSummary = chartInstance;
  }

 // update Stockchart Highcharts
  updateSeriesData(data: Array<any>) {
   // console.log('button UpdateSeriesData()');
    this.chartStock['series'][0].setData(this.portfolioTickers);
    this.getPiechartData();
    console.log(this.sharesArray);
    this.chartPie['series'][0].setData(this.sharesArray);
    console.log(this.summaryTickers);
    this.chartSummary['series'][0].setData(this.summaryTickers);
  }

  getPiechartData() {
    let total = 0;
    for (let i = 0; i < this.coinmarket.length; i++) {
      if (this.coinmarket[i].value) {
        total += this.coinmarket[i].value;
      }
      if (this.coinmarket[i].value) {
        this.sharesArray.push({name: this.coinmarket[i].symbol, y: this.coinmarket[i].value});
      }
     // return total;
     // console.log(total);
      // console.log(this.sharesArray);
    }
  }

  ngOnInit() {

    this.dataStorageService.retrievePortfolioTicker('UserId');
    this.dataStorageService.retrieveSummaryTicker('CoinMarketCap');

    this.subscription = this.coinmarketService.portfolioTickersChanged
      .subscribe(
        (tickers: any) => {
          this.portfolioTickers = tickers; } );
          this.portfolioTickers = this.coinmarketService.getPortfolioTickers();
          console.log(this.portfolioTickers);

    //  code om de coinmarket data op te halen uit de coinmarket service
    this.subscription2 = this.coinmarketService.coinmarketChanged
      .subscribe(
        (coinmarket: CoinCryptocoin[]) => {
          this.coinmarket = coinmarket; } );
          this.coinmarket = this.coinmarketService.getMarket();


    this.subscription3 = this.coinmarketService.summaryTickersChanged
      .subscribe(
        (tickers2: any) => {
          this.summaryTickers = tickers2; } );
          this.summaryTickers = this.coinmarketService.getSummaryTickers();
          console.log(this.summaryTickers);
  }
}


