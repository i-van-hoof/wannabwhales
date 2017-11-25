
import {Component, Input, OnInit, OnChanges} from '@angular/core';
import { PortfolioModel} from '../../portfolio.model';
import { SharedService} from '../../filter.service';
import { Subscription} from 'rxjs/Subscription';
import { CoinCryptocoin} from '../../../home/coinmarket.model';

@Component({
  selector: 'app-portfolio-item',
  templateUrl: './portfolio-item.component.html',
  styleUrls: ['./portfolio-item.component.css']
})
export class PortfolioItemComponent implements OnInit {


  @Input() index: number;
  @Input() marketItem: PortfolioModel;
  @Input() inportfolio: boolean;
  @Input() coinmarketItem: CoinCryptocoin;
  @Input() symbol: string;
  // subscription: Subscription;

  onMain: Boolean = true;

  // doSomething() {console.log('changed')};

  constructor() {

  }

  ngOnInit() {
    // this.subscription = this.ss.getEmittedValue()
     // .subscribe(item => this.onMain = item);
  }





}





