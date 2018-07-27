import { Component, Input, OnInit} from '@angular/core';
import { MarketDataModel} from '../../market-data.model';

@Component({
  selector: 'app-home-item',
  templateUrl: './home-item.component.html',
  styleUrls: ['./home-item.component.css']
})
export class HomeItemComponent implements OnInit {
  @Input() coinmarket: MarketDataModel;
  @Input() index: number;

  ngOnInit() {
  }

}
