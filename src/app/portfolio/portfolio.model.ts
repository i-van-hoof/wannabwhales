import {Transaction} from '../shared/transaction.model';

export class PortfolioModel {
  public id: string;
  public name: string;
  public symbol: string;
  public wishlist: boolean;
  public inportfolio: boolean;
  public balance: number;
  //new line
  public value: number;
  public available: number;
  public pending: number;
  public firstdate: number;
  public exitdate: number;
  public openbuyorders: number;
  public opensellorders: number;
  public walletadress: string;
  public transactions: Transaction[];

  constructor(
    id: string,
    name: string,
    symbol: string,
    wishlist: boolean,
    inportfolio: boolean,
    balance: number,
    //new line
    value: number,
    available: number,
    pending: number,
    firstdate: number,
    exitdate: number,
    openbuyorders: number,
    opensellorders: number,
    walletadress: string,
    transactions: Transaction[],
  )
  // transactions: Transaction[]
  {
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.wishlist = wishlist;
    this.inportfolio = inportfolio;
    this.balance = balance;
    this.value = value;
    this.available = available;
    this.pending = pending;
    this.firstdate = firstdate;
    this.exitdate = exitdate;
    this.openbuyorders = openbuyorders;
    this.opensellorders = opensellorders;
    this.walletadress = walletadress;
    this.transactions = transactions;
  }

}


