import {Transaction} from '../shared/transaction.model';

export class Cryptocoin {
  public id: string;
  public name: string;
  public imagePath: string;
  public symbol: string;
  public rank: string;
  public price_usd: number;
  public price_btc: number;
  public volume_usd: number;
  public market_cap_usd: number;
  public available_supply: number;
  public total_supply: number;
  public percent_change_1h: number;
  public percent_change_24h: number;
  public percent_change_7d: number;
  public last_updated: number;
  public transactions: Transaction[];

  constructor(
    symbol: string,
    name: string,
    imagePath: string,
    price_btc: number,
    volume_usd: number,
    market_cap_usd: number,
    transactions: Transaction[]) {
      this.symbol = symbol;
      this.name = name;
      this.imagePath = imagePath;
      this.price_btc = price_btc;
      this.volume_usd = volume_usd;
      this.market_cap_usd = market_cap_usd;
      this.transactions = transactions;
  }

}
