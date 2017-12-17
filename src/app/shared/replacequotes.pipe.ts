import { Pipe, PipeTransform } from '@angular/core';


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/

@Pipe({name: 'jsonquotes', pure: false})

export class JsonQuotesPipe implements PipeTransform {
  transform(value: any): string { return value; }
  // transform(value: any): string { return JSON.stringify(value, null, 2); }
}
