
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MarketComponent} from './market/market.component';

import {WishListComponent} from './wish-list/wish-list.component';
import {HomeComponent} from './home/home.component';
import {PortfolioStartComponent} from './portfolio/portfolio-start/portfolio-start.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {PortfolioDetailComponent} from './portfolio/portfolio-detail/portfolio-detail.component';
import {PortfolioEditComponent} from './portfolio/portfolio-edit/portfolio-edit.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SigninComponent} from './auth/signin/signin.component';
import {PortfolioListComponent} from './portfolio/portfolio-list/portfolio-list.component';
import {ItemsListComponent} from './items/items-list/items-list.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/portfolio', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
   { path: 'cryptocoins', component: ItemsListComponent },
  { path: 'portfolio', component: PortfolioComponent, children: [
    { path: '', component: PortfolioStartComponent, pathMatch: 'full'},
    { path: ':symbol', component: PortfolioDetailComponent},
    { path: ':symbol/edit', component: PortfolioEditComponent }
  ] },
  { path: 'transactions', component:  WishListComponent },
  { path: 'signup', component:  SignupComponent },
  { path: 'signin', component:  SigninComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {


}
