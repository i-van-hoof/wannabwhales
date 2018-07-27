import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
// import { ActivatedRoute, Router} from '@angular/router';
import { CoinmarketService} from '../coinmarket.service';
import { DataStorageService} from '../../shared/data-storage.service';
import { MarketDataModel } from '../market-data.model';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css']
})
export class HomeListComponent implements OnInit, OnDestroy {
  coinmarket: MarketDataModel[];
  marketData: MarketDataModel[];
  // marketData =
  // [{ id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00}
  //   ,
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00},
  //   { id: 'bitcoin',
  //   name: 'Bitcoin',
  //   symbol: 'BTC',
  //   rank: 1,
  //   price_usd: 6717.18,
  //   price_btc: 1,
  //   market_cap_usd: 100000,
  //   volume_24h: 25000000,
  //   percent_change_1h: 0.06,
  //   percent_change_7d: 4.90,
  //   percent_change_24h: 56.00}
  // ];

  subscription: Subscription;
  subscription2: Subscription;
  loading = false;
  start: number = 0;
  active: Boolean = false;

  constructor(private coinmarketService: CoinmarketService, private dataService: DataStorageService) {}

  ngOnInit() {

    this.loading = true;
    this.dataService.getHTTPcall('market', '', 0 ,  100).then( () => this.loading = false);

    this.subscription2 = this.coinmarketService.marketDataChanged
      .subscribe(
        (marketData: MarketDataModel[]) => {
          this.marketData = marketData; } );
  }

  ngOnDestroy() {
    this.subscription2.unsubscribe();
  }

  button(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start = 0;
    this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
  }

  buttonCoin(coin: string) {
    this.loading = true;
    this.dataService.getHTTPcall('market', coin, 0, 20).then( () => this.loading = false);
  }

  buttonPrevious(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    if (this.start > 0) { this.start -= 100; }
    this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
  }

  buttonNext(portfolio: string, coin: string, start: number, limit: number) {
    this.loading = true;
    this.start += 100;
    this.dataService.getHTTPcall('market', '', this.start, 100).then( () => this.loading = false);
  }
}
