import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2,} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Directive({
  selector: '[appMyHighlight]'

})
export class HighlightDirective implements OnInit {
  // constructor(private el: ElementRef, private renderer: Renderer2) { }
//  @HostBinding('class.highlight') isOpen= false;

  // @HostListener('valueChange') toggleOpen() {
    // this.isOpen = !this.isOpen; }


  ngOnInit() {}

 // @HostListener('mouseenter') mouseover(eventData: Event) {
    // this.renderer.setStyle(this.el.nativeElement, 'background-color',
    //  'yellow'); }

 // @HostListener('mouseleave') mouseover2(eventData: Event) {
     // this.renderer.setStyle(this.el.nativeElement, 'background-color',
     //   'transparent');

  }







