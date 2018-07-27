
import { Component, Input, OnInit } from '@angular/core';
import { portfolioDataModel} from '../../../home/portfolio-data.model';

@Component({
  selector: 'app-portfolio-item',
  templateUrl: './portfolio-item.component.html',
  styleUrls: ['./portfolio-item.component.css']
})
export class PortfolioItemComponent implements OnInit {

  @Input() index: number;
  @Input() inportfolio: boolean;
  @Input() coinmarketItem: portfolioDataModel;
  @Input() symbol: string;
  // subscription: Subscription;

  onMain: Boolean = true;

  constructor() {

  }

  ngOnInit() {
  }

}





