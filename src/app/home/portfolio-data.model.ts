export class portfolioDataModel {
  public id: string;
  public name: string;
  public balance: number;
  public symbol: string;
  public rank: string;
  public value: number;
  public previous_value: number;
  public y: number;
  public price_usd: number;
  public price_btc: number;
  public volume_24h: number;
  public market_cap_usd: number;
  public available_supply: number;
  public total_supply: number;
  public max_supply: number;
  public percent_change_1h: number;
  public percent_change_24h: number;
  public percent_change_7d: number;
  public last_updated: number;
  public inportfolio: boolean;
  // public balance: number;
  // public value: number;
  // public inportfolio: boolean;
  // public transactions: Transaction[];

  constructor(
    id: string,
    name: string,
    balance: number,
    symbol: string,
    rank: string,
    value: number,
    previous_value: number,
    y: number,
    price_usd: number,
    price_btc: number,
    volume_24h: number,
    market_cap_usd: number,
    available_supply: number,
    total_supply: number,
    max_supply: number,
    percent_change_1h: number,
    percent_change_24h: number,
    percent_change_7d: number,
    last_updated: number,
    inportfolio: boolean
    // balance: number,
    // value: number,
    // inportfolio: boolean,

  )
  // transactions: Transaction[]
  {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.symbol = symbol;
    this.rank = rank;
    this.value  = value;
    this.previous_value = previous_value;
    this.y  = y;
    this.price_usd = price_usd;
    this.price_btc = price_btc;
    this.volume_24h = volume_24h;
    this.market_cap_usd = market_cap_usd;
    this.available_supply = available_supply;
    this.total_supply = total_supply;
    this.max_supply = max_supply;
    this.percent_change_1h = percent_change_1h;
    this.percent_change_24h = percent_change_24h;
    this.percent_change_7d = percent_change_7d;
    this.last_updated = last_updated;
    this.inportfolio = inportfolio;
    // this.balance = balance;
    // this.value = value;
    // this.inportfolio = inportfolio;
    // this.transactions = transactions;
  }

}
