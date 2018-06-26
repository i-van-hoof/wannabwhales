import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';

// export
const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyCxS-yQCgYUWTBDdPJFT3sIz-blK3dSSys',
    authDomain: 'whalesapp-test-mr2.firebaseapp.com',
    databaseURL: 'https://whalesapp-test-mr2.firebaseio.com',
    projectId: 'whalesapp-test-mr2',
    storageBucket: 'whalesapp-test-mr2.appspot.com',
  }
};

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
