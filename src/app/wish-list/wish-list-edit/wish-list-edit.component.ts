import {Component, OnInit} from '@angular/core';
import {Transaction} from '../../shared/transaction.model';
import {TransactionService} from '../transaction.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-wish-list-edit',
  templateUrl: './wish-list-edit.component.html',
  styleUrls: ['./wish-list-edit.component.css']
})
export class WishListEditComponent implements OnInit {


  constructor(private trService: TransactionService) { }

  ngOnInit() {

  }

  onAddTransaction(form: NgForm) {
    const value = form.value;
    // check of de value.transaction_price_btc hieronder goed gaat, moeten dit niet de namen in het form zijn? zit een dubbeling met ander form?
    const newTransaction = new Transaction(
      value.orderType,
      value.symbol,
      value.tradingPair,
      value.amount,
      value.transaction_price_btc,
      value.txTotalBtc,
      value.txTotalUsd,
      value.txExchange,
      value.fillType,
      value.transaction_time);
    this.trService.addTransaction(newTransaction);
  }


}


