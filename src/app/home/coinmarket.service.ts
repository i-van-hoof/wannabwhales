

import { Injectable} from '@angular/core';
import { Transaction} from '../shared/transaction.model';
import { TransactionService } from '../wish-list/transaction.service';

import { Subject } from 'rxjs/Subject';
import { CoinCryptocoin } from './coinmarket.model';
import { PortfolioModel } from '../portfolio/portfolio.model';
import { marketDataModel} from './market-data.model';

@Injectable()
export class CoinmarketService {
  coinmarketChanged = new Subject<CoinCryptocoin[]>();
  marketDataChanged = new Subject<marketDataModel[]>();
  portfolioChanged = new Subject<PortfolioModel[]>();
  portfoliosymbolsChanged = new Subject();
  tickersChanged = new Subject();
  portfolioTickersChanged = new Subject();
  summaryTickersChanged = new Subject();

  private coinmarket: CoinCryptocoin[] = [];
  private marketData: marketDataModel[] = [];
  private tickers = [];
  private portfolioTickers = [];
  private summaryTickers = [];
  private portfolio: PortfolioModel[] = [];
  private portfoliosymbols = [];
  // private transactions: Transaction[] = [];

  constructor(private trService: TransactionService) {}

  getMarket() {
    return this.coinmarket.slice();
  }

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

  setCoinmarket(coinmarket: CoinCryptocoin[]) {
    this.coinmarket = coinmarket;
    this.coinmarketChanged.next(this.coinmarket.slice());
  }

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

  setPortfolio(portfolio: PortfolioModel[]) {
    this.portfolio = portfolio;
    this.portfolioChanged.next(this.portfolio.slice());
  }

  getPortfolioItem(symbol: string) {
   // console.log(symbol);
    const index = this.portfolio.findIndex(p => p['symbol'] === symbol);
    return this.portfolio[index];
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

  updatePortfolio(symbol: string, newPortfolio: PortfolioModel) {
    const index = this.portfolio.findIndex(p => p.symbol === symbol);
    this.portfolio[index] = newPortfolio;
    this.portfolioChanged.next(this.portfolio.slice());
  }

  updatePortfolioSymbols(symbol: string) {
    if ( this.portfoliosymbols.findIndex(p => p.symbol === symbol)) {console.log('symbol is in portfoliosymbols')}
    this.portfoliosymbolsChanged.next(this.portfoliosymbols.slice());
  }

  addPortfolio(portfolio: PortfolioModel) {
    this.portfolio.push(portfolio);
    this.portfolioChanged.next(this.portfolio.slice());
  }



}


