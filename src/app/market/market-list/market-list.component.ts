import {Component, OnInit} from '@angular/core';
import {Cryptocoin} from '../market.model';
import {MarketService} from '../market.service';

@Component({
  selector: 'app-market-list',
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.css']
})
export class MarketListComponent implements OnInit {
  market: Cryptocoin[];

  constructor(private marketService: MarketService) { }

  ngOnInit() {
    this.market = this.marketService.getMarket2();
  }


}


