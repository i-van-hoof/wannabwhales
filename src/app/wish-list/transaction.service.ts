import {Transaction} from '../shared/transaction.model';
// import {EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Subject';

export class TransactionService {
  transactionsChanged = new Subject<Transaction[]>();
  transactions: Transaction[] = [
    new Transaction( 'Buy', 'ETH', 'BTC', 1.08, 0.054, 0.2, 305.2, 'Bittrex', 'Fill', 1506361701),
  ];

  getTransactions() {
    return this.transactions.slice();
  }

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction);
    this.transactionsChanged.next(this.transactions.slice());
    console.log(this.transactions);
  }

  addTransactions(transactions: Transaction[]) {
    this.transactions.push(...transactions);
    this.transactionsChanged.next(this.transactions.slice());

  }

  setTransactions(transactions: Transaction[]) {
      this.transactions = transactions;
      this.transactionsChanged.next(this.transactions.slice());
      console.log('this are the server transactions');
      console.log(transactions);
    }
}



