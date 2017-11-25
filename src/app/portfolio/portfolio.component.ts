
import {Component, Directive, Input, OnInit} from '@angular/core';
import {PortfolioDetailComponent} from './portfolio-detail/portfolio-detail.component';


@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'}

})
class DefaultImage {
  @Input() src:string;
  @Input() default:string;

  updateUrl() {
    this.src = this.default;
  }
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],

})
export class PortfolioComponent implements OnInit {



  constructor() {

  }

  ngOnInit() {}



}
