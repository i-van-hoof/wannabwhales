import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CoinmarketService} from '../../home/coinmarket.service';

@Component({
  selector: 'app-portfolio-edit',
  templateUrl: './portfolio-edit.component.html',
  styleUrls: ['./portfolio-edit.component.css']
})
export class PortfolioEditComponent implements OnInit {
  symbol: string;
  editMode = false;
  portfolioForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private coinmarketService: CoinmarketService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.symbol = params['symbol'];
          this.editMode = params['symbol'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    console.log(this.editMode);
    if (this.editMode) {
      console.log('hier updatePortfolio() vanuit form portfolio-edit');
      console.log(this.symbol);
      console.log(this.portfolioForm.value);
      this.coinmarketService.updatePortfolio(this.symbol, this.portfolioForm.value);
     // this.coinmarketService.updatePortfolioSymbols(this.symbol, this.portfolioForm.value);
    } else {
      this.coinmarketService.addPortfolio(this.portfolioForm.value);
    }
    this.onCancel();
  }

  // onAddTransaction() {
   // (<FormArray>this.portfolioForm.get('transactions')).push(
    //  new FormGroup({
     //   'name': new FormControl(null, Validators.required),
      //  'amount': new FormControl(null, [
        //  Validators.required,
        //  Validators.pattern(/^[1-9]+[0-9]*$/)
        // ])
      // })
    // );
  // }

  // onDeleteTransaction(index: number) {
    // (<FormArray>this.portfolioForm.get('transactions')).removeAt(index);
 // }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  private initForm() {
    let portfolioSymbol = '';
    let portfolioId = '';
    let portfolioName = '';
    let portfolioBalance;
    let portfolioInportfolio: boolean;

    let portfolioTransactions = new FormArray([]);

    if (this.editMode) {
      const portfolio = this.coinmarketService.getPortfolioItem(this.symbol);
      portfolioSymbol = portfolio.symbol;
      portfolioId = portfolio.id;
      portfolioName = portfolio.name;
      portfolioBalance = portfolio.balance;
      portfolioInportfolio = portfolio.inportfolio;

      if (portfolio['transactions']) {
        for (let transaction of portfolio.transactions) {
          portfolioTransactions.push(
            new FormGroup({

              'symbol': new FormControl(transaction.symbol, Validators.required),
              'amount': new FormControl(transaction.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.portfolioForm = new FormGroup({
      'symbol': new FormControl(portfolioSymbol, Validators.required),
      'id': new FormControl(portfolioId, Validators.required),
      'name': new FormControl(portfolioName, Validators.required),
      'balance': new FormControl(portfolioBalance, Validators.required),
      'inportfolio': new FormControl(portfolioInportfolio, Validators.required),
    });
  }}

