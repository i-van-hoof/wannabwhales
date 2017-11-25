import {Transaction} from '../shared/transaction.model';

export class CoinCryptocoin {
  public id: string;
  public name: string;
  public symbol: string;
  public rank: string;
  public price_usd: number;
  public price_btc: number;
  public volume_24h: number;
  public volume_usd: string;
  public market_cap_usd: number;
  public available_supply: number;
  public total_supply: number;
  public percent_change_1h: number;
  public percent_change_24h: string;
  public percent_change_7d: string;
  public last_updated: number;
  // public transactions: Transaction[];

  constructor(
    id: string,
    name: string,
    symbol: string,
    rank: string,
    price_usd: number,
    price_btc: number,
    volume_24h: number,
    market_cap_usd: number,
    available_supply: number,
    total_supply: number,
    percent_change_1h: number,
    percent_change_24h: string,
    percent_change_7d: string,
    last_updated: number,
  )
  // transactions: Transaction[]
  {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.rank = rank;
    this.price_usd = price_usd;
    this.price_btc = price_btc;
    this.volume_24h = volume_24h;
    this.market_cap_usd = market_cap_usd;
    this.available_supply = available_supply;
    this.total_supply = total_supply;
    this.percent_change_1h = percent_change_1h;
    this.percent_change_24h = percent_change_24h;
    this.percent_change_7d = percent_change_7d;
    this.last_updated = last_updated;


    // this.transactions = transactions;
  }

}


