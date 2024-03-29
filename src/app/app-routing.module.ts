import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './core/authentication/authGuard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'movies', loadChildren: './components/movies/movies.module#MoviesModule'},
  { path: 'admin', loadChildren: './components/administration/administration.module#AdministrationModule', canActivate: [AuthGuard] },
  { path: 'account', loadChildren: './components/settings/settings.module#SettingsModule', canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
