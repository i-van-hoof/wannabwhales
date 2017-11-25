import {Component, Input, OnInit} from '@angular/core';
import {Cryptocoin} from '../../market.model';
import {MarketService} from '../../market.service';

@Component({
  selector: 'app-market-item',
  templateUrl: './market-item.component.html',
  styleUrls: ['./market-item.component.css']
})
export class MarketItemComponent implements OnInit {
  @Input() marketItem: Cryptocoin;


  constructor(private marketService: MarketService) { }

  ngOnInit() {
  }

  onSelected() {
    this.marketService.marketItemSelected.emit(this.marketItem);
  }
}
