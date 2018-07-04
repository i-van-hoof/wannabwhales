import {Component, Injectable, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CoinmarketService} from '../../home/coinmarket.service';
import {AuthService} from '../../auth/auth.service';
import {Response} from '@angular/http';
import {DataStorageService} from '../../shared/data-storage.service';



@Component({
  selector: 'app-portfolio-edit',
  templateUrl: './portfolio-edit.component.html',
  styleUrls: ['./portfolio-edit.component.css']
})

export class PortfolioEditComponent implements OnInit {
  symbol: string;
  editMode;
  portfolioForm: FormGroup;
  formGroup: FormGroup;
  formArray: FormArray;

  constructor(private route: ActivatedRoute,
              private coinmarketService: CoinmarketService,
              private dataStorageService: DataStorageService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.symbol = params['symbol'];
          this.editMode = params['symbol'] != null;
          console.log('system in edit mode for symbol: ' + params['symbol']);
          this.authService.isInEditmode();
          this.initForm(this.symbol);
        }
      );
  }

  onSubmit() {
    console.log(this.editMode);
    if (this.editMode) {
      console.log('updatePortfolio() vanuit portfolio-edit');
      console.log(this.symbol);
       if (this.portfolioForm.value.inportfolio) {
          this.coinmarketService.updateUserPortfolio(this.symbol, this.portfolioForm.value);
     // this.coinmarketService.updatePortfolioSymbols(this.symbol, this.portfolioForm.value);
        } else { console.log('this data added to the UserPortfolio');
          this.coinmarketService.addToUserPortfolio(this.portfolioForm.value);
        }
        this.onCancel();
        this.dataStorageService.storePortfolio()
         //  .subscribe(
         //   (response: Response) => {console.log(response);}
         // );
      }

  // onAddTransaction() {
  //  (<FormArray>this.portfolioForm.get('transactions')).push(
  //    new FormGroup({
  //      'name': new FormControl(null, Validators.required),
  //      'amount': new FormControl(null, [
  //        Validators.required,
  //        Validators.pattern(/^[1-9]+[0-9]*$/)
  //       ])
  //     })
  //   );
  // }

  // onDeleteTransaction(index: number) {
    // (<FormArray>this.portfolioForm.get('transactions')).removeAt(index);
 }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
    this.editMode = false;
    this.authService.isOutEditmode();
  }

  private initForm(symbol) {
    let portfolioSymbol = '';
    let portfolioId = '';
    let portfolioName = '';
    let portfolioBalance;
    let portfolioValue;
    let portfolioInportfolio: boolean;
    this.formArray = new FormArray([]);

    if (this.editMode) {
      const portfolio = this.coinmarketService.getPortfolioItem(symbol);
      console.log('getPortfolioItem:' + portfolio.symbol);
        portfolioSymbol = portfolio.symbol;
        console.log(portfolioSymbol);
        portfolioId = portfolio.id;
        portfolioName = portfolio.name;
        portfolioBalance = portfolio.balance;
        portfolioValue = portfolio.value;
        portfolioInportfolio = portfolio.inportfolio;

      // if (portfolio['transactions']) {
      //   for (let transaction of portfolio.transactions) {
      //     this.formArray.push(
      //       new FormGroup({
      //
      //         'symbol': new FormControl(transaction.symbol, Validators.required),
      //         'amount': new FormControl(transaction.amount, [
      //           Validators.required,
      //           Validators.pattern(/^[1-9]+[0-9]*$/)
      //         ])
      //       })
      //     );
      //   }
      // }
    }

    this.portfolioForm = new FormGroup({
      'symbol': new FormControl(portfolioSymbol, Validators.required),
      'id': new FormControl(portfolioId, Validators.required),
      'name': new FormControl(portfolioName, Validators.required),
      'balance': new FormControl(portfolioBalance, Validators.required),
      'value': new FormControl(portfolioValue, Validators.required),
      'inportfolio': new FormControl(portfolioInportfolio, Validators.required),
      'transactions': this.formArray
    });
  }}

