

import { Injectable} from '@angular/core';
import { Transaction} from '../shared/transaction.model';
import { TransactionService } from '../wish-list/transaction.service';

import { Subject } from 'rxjs/Subject';
import { CoinCryptocoin } from './coinmarket.model';
import { PortfolioModel } from '../portfolio/portfolio.model';
import { marketDataModel} from './market-data.model';
import { portfolioDataModel} from './portfolio-data.model';

@Injectable()
export class CoinmarketService {
  coinmarketChanged = new Subject<CoinCryptocoin[]>();
  marketDataChanged = new Subject<marketDataModel[]>();
  portfolioChanged = new Subject<portfolioDataModel[]>();
  portfolioDataChanged = new Subject<portfolioDataModel[]>();
  portfoliosymbolsChanged = new Subject();
  tickersChanged = new Subject();
  portfolioTickersChanged = new Subject();
  summaryTickersChanged = new Subject();

  private coinmarket: CoinCryptocoin[] = [];
  private marketData: marketDataModel[] = [];
  private portfolioData: portfolioDataModel[] = [];
  private tickers = [];
  private portfolioTickers = [];
  private summaryTickers = [];
  private portfolio: portfolioDataModel[] = [];
  private portfoliosymbols = [];
  // private transactions: Transaction[] = [];

  constructor(private trService: TransactionService) {}

  getTickers() {
    return this.tickers.slice();
  }

  getPortfolioTickers() {
    return this.portfolioTickers.slice();
  }

  getSummaryTickers() {
    return this.summaryTickers.slice();
  }

  getPortfolio() {
    return this.portfolio.slice();
  }

  getPortfolioData() {
    return this.portfolioData.slice();
  }

  getMarket() {
    return this.marketData.slice();
  }

  setPortfolio(portfolio: portfolioDataModel[]) {
    this.portfolio = portfolio;
    console.log('setPortfolio() in coinmarket-service');
    for (let object of this.portfolio) {
      const index = this.portfolioData.findIndex(p => p.symbol === object.symbol);
      if (index >= 0) {
        object['balance'] = this.portfolioData[index].balance;
        object['y'] = this.portfolioData[index].balance * object['price_usd'];
        object['inportfolio'] = true; } else {
        object['balance'] = 0;
        object['y'] = 0;
        object['inportfolio'] = false; }
    }
    console.log(this.portfolio);
    this.portfolioChanged.next(this.portfolio.slice());
  }

  setPortfolioData(data: portfolioDataModel[]) {
    this.portfolioData = data;
    this.portfolioDataChanged.next(this.portfolioData.slice());
  }

  setCoinmarket(coinmarket: CoinCryptocoin[]) {
    this.coinmarket = coinmarket;
    this.coinmarketChanged.next(this.coinmarket.slice());
  }

  // set data voor Home page met coinmarket cap info
  setMarketData(marketData: marketDataModel[]) {
    this.marketData = marketData;
    this.marketDataChanged.next(this.marketData.slice());
  }

  setTicker(tickers: any) {
    this.tickers = tickers;
    this.tickersChanged.next(this.tickers.slice());
   // console.log(tickers);
  }

  setPortfolioTicker(tickers: any) {
    this.portfolioTickers = tickers;
    this.portfolioTickersChanged.next(this.portfolioTickers.slice());
    // console.log(tickers);
  }

  setSummaryTicker(tickers: any) {
    this.summaryTickers = tickers;
    this.summaryTickersChanged.next(this.summaryTickers.slice());
    // console.log(tickers);
  }

  getPortfolioItem(symbol: string) {
   // console.log(symbol);
    const index = this.portfolio.findIndex(p => p['symbol'] === symbol);
    return this.portfolio[index];
  }

  getPortfolioDataItem(symbol: string) {
    // console.log(symbol);
    const index = this.portfolioData.findIndex(p => p['symbol'] === symbol);
    return this.portfolioData[index];
  }

  getCoinmarketItem(symbol: string) {
    const index2 = this.coinmarket.findIndex(p => p.symbol === symbol);
    return this.coinmarket[index2];
  }

  // getTickerItem(symbol: string) {
  //   console.log(symbol);
  //   const index = this.tickers.findIndex(p => p['symbol'] === symbol);
  //   return this.tickers[index];
  // }

  addTransactionsToTransactions(transactions: Transaction[]) {
    this.trService.addTransactions(transactions);
  }

//  deletePortfolioItem(index: number) {
  //  this.portfolio.splice(index, 1);
    //this.portfolio.next(this.portfolio.slice());
  //}

  updatePortfolio(symbol: string, newPortfolio: portfolioDataModel) {

    const index = this.portfolio.findIndex(p => p.symbol === symbol);
    this.portfolio[index] = newPortfolio;
    this.portfolioChanged.next(this.portfolio.slice());
  }

  updateUserPortfolio(symbol: string, newPortfolio: portfolioDataModel) {
    console.log(this.portfolioData);
    const index = this.portfolioData.findIndex(p => p.symbol === symbol);
    this.portfolioData[index] = newPortfolio;
    console.log(newPortfolio);
    this.portfolioDataChanged.next(this.portfolioData.slice());
  }

  updatePortfolioSymbols(symbol: string) {
    if ( this.portfoliosymbols.findIndex(p => p.symbol === symbol)) {console.log('symbol is in portfoliosymbols')}
    this.portfoliosymbolsChanged.next(this.portfoliosymbols.slice());
  }

  addToUserPortfolio(portfolio: portfolioDataModel) {
    this.portfolioData.push(portfolio);
    this.portfolioDataChanged.next(this.portfolioData.slice());
    console.log(this.portfolioData);
  }



}


