import {Component, Input, OnInit} from '@angular/core';
import {Cryptocoin} from '../market.model';

@Component({
  selector: 'app-market-detail',
  templateUrl: './market-detail.component.html',
  styleUrls: ['./market-detail.component.css']
})
export class MarketDetailComponent implements OnInit {
  @Input() marketItem: Cryptocoin;

  constructor() { }

  ngOnInit() {
  }

}
