import { Component, OnInit } from '@angular/core';
import { Cryptocoin} from './market.model';
import {MarketService} from './market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
  providers: [MarketService],
})
export class MarketComponent implements OnInit {
  selectedRecipe: Cryptocoin;

  constructor(private marketService: MarketService) { }

  ngOnInit() {
    this.marketService.marketItemSelected
      .subscribe(
        (marketItem: Cryptocoin) => {
          this.selectedRecipe = marketItem
        }
      )
  }

}
