import { Injectable,  Output, EventEmitter} from '@angular/core';


@Injectable()
export class SharedService {
  @Output() fire: EventEmitter<any>= new EventEmitter();
  testing = true;

  constructor(){
    console.log('shared service started');
  }

  change()
  {
    console.log('change started');
    this.testing = !this.testing;
    console.log(this.testing);
    this.fire.emit(this.testing);
  }

  getEmittedValue() {
    return this.fire;
  }

}


