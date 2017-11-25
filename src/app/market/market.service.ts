import {Cryptocoin} from './market.model';
import {EventEmitter, Injectable} from '@angular/core';
import {Transaction} from '../shared/transaction.model';
import {TransactionService} from '../wish-list/transaction.service';
import {PortfolioModel} from '../portfolio/portfolio.model';

@Injectable()
export class MarketService {
  marketItemSelected = new EventEmitter<Cryptocoin>();
 // portfolioItemSelected = new EventEmitter<PortfolioModel>();

  private market: Cryptocoin[] = [
    new Cryptocoin(
      'BTC', 'Bitcoin', 'https://www.cryptocompare.com/media/19633/btc.png?width=200', 1, 45245, 45, []),
    // new Cryptocoin(
    //  'ETH', 'Ethereum', 'http://files.coinmarketcap.com.s3-website-us-east-1.amazonaws.com/static/img/coins/200x200/ethereum.png', 0.0744025, 23.235, 789, []),
    //new Cryptocoin(
    //  'BCC', 'Bitcoin Cash', 'http://files.coinmarketcap.com.s3-website-us-east-1.amazonaws.com/static/img/coins/200x200/bitcoin-cash.png', 0.544025, 235.452, 452, []),
    // new Cryptocoin(
    //  'XRP', 'Ripple', 'https://pbs.twimg.com/media/DASzzJXXUAEt5it.png', 5.0744250, 2.355, 34553, []),
    //new Cryptocoin(
     // 'LTC', 'LiteCoin', 'https://pbs.twimg.com/profile_images/498948297805946880/h58GUeGf_400x400.png', 0.01329600, 2777912054 , 34553, []),
  ];

  constructor(private trService: TransactionService) {}

  getMarket2() {
    return this.market.slice();
  }
}

