export class Transaction {
  public orderType: string;
  public symbol: string;
  public tradingPair: string;
  public amount: number;
  public transaction_price_btc: number;
  public txTotalBtc: number;
  public txTotalUsd: number;
  public txExchange: string;
  public fillType: string;
  public transaction_time: number;

  constructor(orderType: string,
              symbol: string,
              tradingPair: string,
              amount: number,
              transaction_price_btc: number,
              txTotalBtc: number,
              txTotalUsd: number,
              txExchange: string,
              fillType: string,
              transaction_time: number) {

    this.orderType = orderType;
    this.symbol = symbol;
    this.tradingPair = tradingPair;
    this.amount = amount;
    this.transaction_price_btc = transaction_price_btc;
    this.txTotalBtc = txTotalBtc;
    this.txTotalUsd = txTotalUsd;
    this.txExchange = txExchange;
    this.fillType = fillType;
    this.transaction_time = transaction_time;
  }
}



