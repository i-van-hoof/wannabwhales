import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { CoinCryptocoin} from '../../coinmarket.model';
import {Observable} from 'rxjs/Observable';
import { marketDataModel} from '../../market-data.model';

@Component({
  selector: 'app-home-item',
  templateUrl: './home-item.component.html',
  styleUrls: ['./home-item.component.css']
})
export class HomeItemComponent implements OnInit, OnChanges {
  @Input() coinmarket: CoinCryptocoin;
  // @Input() marketData: marketDataModel;
  @Input() index: number;
  idArray = {};
  array = [];
  // timer = Observable.timer(5000, 6000);
  // previousUpdate: number;
  // updated = false;

 // constructor() {
  //  this.timer.subscribe(t => this.changeValue());
  // }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const length = JSON.stringify(changes);
    const changeObject = changes.coinmarket.currentValue;

    for (let propName in changes) {
      if (propName === 'coinmarket') {
        const changeValues = changes[propName];
        const curVal2  = JSON.stringify(changeValues.currentValue.symbol);
        const curVal  = +JSON.stringify(changeValues.currentValue.last_updated);
        this.idArray[curVal2] = curVal;
       }

      }
    }



  // private changeValue() {
    // if (this.coinmarket.last_updated > this.previousUpdate) { this.updated = true; }
    // this.previousUpdate = this.coinmarket.last_updated;
    // console.log(this.updated);
  // }
}
