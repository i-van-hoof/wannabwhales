import {Component, OnDestroy, OnInit} from '@angular/core';
import {Transaction} from '../shared/transaction.model';
import {TransactionService} from './transaction.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],

})
export class WishListComponent implements OnInit, OnDestroy {
  transactions: Transaction[];
  private subscription: Subscription;

  constructor(private trService: TransactionService) { }

  ngOnInit() {
    this.transactions = this.trService.getTransactions();
    this.subscription = this.trService.transactionsChanged
      .subscribe(
        (transactions: Transaction[]) => {
          this.transactions = transactions;
        }
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
