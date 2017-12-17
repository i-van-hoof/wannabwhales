import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
// import { MyDataModel } from './my-data-model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class MyExampleService {
  private url = 'https://api.coinmarketcap.com/v1/global/'; // full uri of the service to consume here

  constructor(private http: Http) { }

  get(): Observable<any> {
    return this.http
      .get(this.url)
      .map((res: Response) => res.json());
  }
}
