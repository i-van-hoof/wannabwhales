import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { ChartModule } from 'angular2-highcharts';
import { DataStorageService } from '../../shared/data-storage.service';
import { Subscription } from 'rxjs/Subscription';
import { CoinmarketService } from '../../home/coinmarket.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Http } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { portfolioDataModel } from '../../home/portfolio-data.model';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  userName: string;
  optionsStockchart: Object;
  optionsPiechart: Object;
  optionsColumn: Object;
  items: Observable<any[]>;
  data: any;
  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  subscriptionTimer: Subscription;
  subscriptionChartTimer: Subscription;
  timerChartsObervable: Observable<any>;
  timer: Observable<any>;
  tickers: any;
  portfolioTickers: any;
  summaryTickers: any;
  chartStock: Object;
  chartPie: Object;
  chartSummary: Object;
  chartColumn: Object;
  portfolioData: portfolioDataModel[];
  sharesArray = [];
  coinsSymbolsArray = [];
  coinsChangeArray = [];
  filteredSummaryItems;
  coinmarketCap: {};
  totalMarketVolume: number;
  totalMarketCap: number;
  totalMarketBitcoin: number;
  maxChangeSymbol: string;
  minChangeSymbol: string;
  xMax: number;
  xMin: number;


// three lines for TimeObservable
//   private observableData: any;
//   private display: boolean; // whether to display info in the component
//                             // use *ngIf="display" in your html to take
//                             // advantage of this
//
//   private alive: boolean; // used to unsubscribe from the IntervalObservable
//                           // when OnDestroy is called.
//   private interval: number;

  constructor(
    db: AngularFireDatabase,
    private dataStorageService: DataStorageService,
    private coinmarketService: CoinmarketService,
    private http: Http,
    afAuth: AngularFireAuth,
    private authService: AuthService

  ) {


    this.userName = authService.getUserEmail();

    // options of the Highstock portfolio value ticker
    this.optionsStockchart = {
      title: {text: ''},


      rangeSelector: {

        buttons: [{
          type: 'day',
          count: 3,
          text: '3d',
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
        selected: 3,

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
        marginRight: 45,
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
        offset: 25,
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
        data: [[1508668560076, 0], [1508768560085, 0]]
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
    // options of the barchart Highcharts for daily price change
    this.optionsColumn = {
      title: false,
      colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
        '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
      chart: {
        type: 'column',
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
      legend: {
        enabled: false
      },
      xAxis: {
        categories: ['LOADING', '', '', '', ''],
        labels: {
          style: {
            color: '#E0E0E3'
          }
      }},
      yAxis: {
        labels: {
          style: {
            color: '#E0E0E3'
          }
        }},
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
              color: 'white',
              textTransform: 'uppercase'
            },
            format: '<b></b>: {point.percentage:.1f} %',
          }
        }
      },
      series: [{
        name: false,
        data: [0, 0, 0, 0, 0]
      }]
    }; };


  saveInstanceStock(chartInstance): void {

    this.chartStock = chartInstance;
  }

  saveInstancePie(chartInstance): void {
    this.chartPie = chartInstance;
  }

  saveInstanceColumn(chartInstance): void {
    this.chartColumn = chartInstance;
  }

  saveInstanceSummary(chartInstance): void {
    this.chartSummary = chartInstance;
  }

  onClickPortfolioButton(e) {
    // console.log("clicked chart");
    console.log('clicked');
    console.log('You clicked ' + e.toElement.innerHTML + ' button');
    if (typeof(e.toElement.innerHTML) !== 'undefined') {
      const c = e.toElement.innerHTML;
      let btn_index = 0;
      let range = 2700;
      if (c === '3d') {
        btn_index = 0;
        range = 250;
      } else if (c === '1w') {
        btn_index = 1;
        range = 700;
      } else if (c === '1m') {
        btn_index = 2;
        range = 2700;
      } else if (c === '6m') {
        btn_index = 3;
        range = 16500;
      } else if (c === '1y') {
        btn_index = 4;
        range = 32000;
      } else if (c === 'All') {
        btn_index = 5;
        range = 32000;
      }
      // Store btn_index in a cookie here and use it
      // to initialise rangeSelector -> selected next
      // time the chart is loaded
      console.log(btn_index);
      console.log(range);
      this.dataStorageService.retrievePortfolioTicker(range);
    }
  }

  onClickSummaryButton(e) {
    // console.log("clicked chart");
    // console.log('You clicked '+e.toElement.innerHTML+" button");
    if(typeof(e.toElement.innerHTML)!== 'undefined') {
      let c = e.toElement.innerHTML;
      let btn_index = 0;
      let range = 2700;
      if(c == "3d"){
        btn_index = 0;
        range = 250;
      } else if(c == "1w"){
        btn_index = 1;
        range = 700
      } else if(c == "1m"){
        btn_index = 2;
        range = 2700;
      } else if(c == "6m"){
        btn_index = 3;
        range = 16500;
      } else if(c == "1y"){
        btn_index = 4;
        range = 32000;
      } else if(c == "All"){
        btn_index = 5;
        range = 32000;
      }
      // Store btn_index in a cookie here and use it
      // to initialise rangeSelector -> selected next
      // time the chart is loaded
      console.log(btn_index);
      console.log(range);
      this.dataStorageService.retrieveSummaryTicker('CoinMarketCap', range);
    }
  }

  // update Stockchart Highcharts
  updateSeriesData() {
   // // console.log('button UpdateSeriesData()');
   //  this.chartStock['series'][0].setData(this.portfolioTickers);
   //  // this.getPiechartData();
   //  console.log(this.sharesArray);
   //  this.chartPie['series'][0].setData(this.sharesArray);
   //  console.log(this.summaryTickers);
   //  this.chartSummary['series'][0].setData(this.summaryTickers);
   //  this.chartColumn['series'][0].setData(this.coinsChangeArray);
   //  this.chartColumn['xAxis'][0].setCategories(this.coinsSymbolsArray);
  }

  // getPiechartData() {
  //   let total = 0;
  //   this.maxChange = 0;
  //   // const maxChangeSymbol;
  //   for (let i = 0; i < this.coinmarket.length; i++) {
  //     if (this.coinmarket[i].value) {
  //       if ( this.coinmarket[i].percent_change_24h > this.maxChange) {
  //       this.maxChange = this.coinmarket[i].percent_change_24h; this.maxChangeSymbol = this.coinmarket[i].symbol; console.log(this.maxChange)};
  //       if ( this.coinmarket[i].percent_change_24h < this.minChange) {
  //         this.minChange = this.coinmarket[i].percent_change_24h; this.minChangeSymbol = this.coinmarket[i].symbol; console.log(this.minChangeSymbol)};
  //       total += 1;
  //       this.sharesArray.push({
  //         name: this.coinmarket[i].symbol,
  //         y: this.coinmarket[i].value,
  //         price_usd: this.coinmarket[i].price_usd,
  //         balance: this.coinmarket[i].balance,
  //         percent_change_1h: this.coinmarket[i].percent_change_1h,
  //         price_btc: this.coinmarket[i].price_btc,
  //         percent_change_24h: this.coinmarket[i].percent_change_24h});
  //       this.coinsSymbolsArray.push(this.coinmarket[i].symbol);
  //       this.coinsChangeArray.push(this.coinmarket[i].percent_change_24h);
  //       }
  //     }
  //     console.log(this.coinsSymbolsArray);
  //   }

  getTotal() {
    let total = 0;
    for (let i = 0; i < this.portfolioData.length; i++) {
      if (this.portfolioData[i].y) {
        total += this.portfolioData[i].y;
      }
    }
    return total;
  }


  ngOnInit() {
    // this.dataStorageService.getUserPortfolioAuth();
    this.dataStorageService.retrievePortfolioTicker(2700);
    this.dataStorageService.retrieveSummaryTicker('CoinMarketCap', 1000);
    // retrieveSummary();

    this.timerChartsObervable = Observable.timer(1000, 5000);
    this.subscriptionChartTimer = this.timerChartsObervable
      .subscribe(x => {
      console.log(this.portfolioData);
      this.sharesArray = [];
      this.coinsSymbolsArray = [];
      this.coinsChangeArray = [];

        // get arrays of portfolio for coins and percent change
        const coinsSymbolsArray = this.portfolioData.map(a => a.id);
        const coinsChangeArray = this.portfolioData.map(a => a.percent_change_24h);

        // get max symbol and max percentage change from portfolio changes array
        this.xMax = Math.max.apply(undefined, coinsChangeArray);
        const a = coinsChangeArray.indexOf(this.xMax);
        this.maxChangeSymbol = coinsSymbolsArray[a];
        // get min symbol and min percentage change from portfolio changes array
        this.xMin = Math.min.apply(undefined, coinsChangeArray);
        const a2 = coinsChangeArray.indexOf(this.xMin);
        this.minChangeSymbol = coinsSymbolsArray[a2];

        // load data in Highcharts.js graphs
        this.chartPie['series'][0].setData(this.portfolioData);
        this.chartStock['series'][0].setData(this.portfolioTickers);
        this.chartSummary['series'][0].setData(this.summaryTickers);
        this.chartColumn['series'][0].setData(coinsChangeArray);
        this.chartColumn['xAxis'][0].setCategories(coinsSymbolsArray);
    });

    this.timer = Observable.timer(10000);
    // .interval(2000)
    // .startWith(500)
    this.subscriptionTimer =
      this.timer.subscribe(x => {
        this.chartPie['series'][0].setData(this.portfolioData);
        this.chartStock['series'][0].setData(this.portfolioTickers);
        this.chartSummary['series'][0].setData(this.summaryTickers);
        this.chartColumn['series'][0].setData(this.coinsChangeArray);
        this.chartColumn['xAxis'][0].setCategories(this.coinsSymbolsArray);
      });

    this.subscription1 = this.coinmarketService.portfolioTickersChanged
      .subscribe(
        (tickers: any) => {
          this.portfolioTickers = tickers; } );
          this.portfolioTickers = this.coinmarketService.getPortfolioTickers();

    this.subscription2 = this.coinmarketService.summaryTickersChanged
      .subscribe(
        (tickers2: any) => {
          this.summaryTickers = tickers2; } );
          this.summaryTickers = this.coinmarketService.getSummaryTickers();

    this.subscription3 = this.coinmarketService.portfolioDataChanged
      .subscribe(
        (portfolioData: portfolioDataModel[]) => {
          this.portfolioData = portfolioData; } );
          this.portfolioData = this.coinmarketService.getPortfolioData();

    // Observable.interval(3000)
    //   .flatMap(() => this.http.get('https://api.coinmarketcap.com/v1/global/')
    //     .map(res => res.json())
    //     .catch((error:any) => Observable.throw(error.json().error || 'Server error')))
    //   .subscribe(data => {
    //     this.coinmarketCap = data;
    //     this.totalMarketVolume = data.total_24h_volume_usd;
    //     this.totalMarketCap = data.total_market_cap_usd;
    //     this.totalMarketBitcoin = data.bitcoin_percentage_of_market_cap;
    //       });

    // function retrieveSummary() {
    //   const marketSummaryRef = this.db.list('MarketSummary/CoinMarketCap'  , ref => ref.limitToLast(1))
    //     .valueChanges();
    //     marketSummaryRef.subscribe( data => {
    //       console.log(data);
    //   });
    // }

  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscriptionTimer.unsubscribe();
    this.subscriptionChartTimer.unsubscribe();



  }
}


