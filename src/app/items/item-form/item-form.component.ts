import {Component, Input, OnInit} from '@angular/core';
import {CoinCryptocoin} from '../../home/coinmarket.model';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  @Input() portfolioCoin: any;
  @Input() index: number;
  @Input() contact: any;

  constructor() { }

  ngOnInit() {
  }

}
