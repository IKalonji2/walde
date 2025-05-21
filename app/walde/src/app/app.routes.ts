import { Routes } from '@angular/router';
import { BuildComponent } from './build/build.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';
import { authGuard } from './auth.guard';
import { FunctionsComponent } from './functions/functions.component';
import { FunctionTesterComponent } from './function-tester/function-tester.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'build/:id', component: BuildComponent, canActivate: [authGuard] },
    { path: 'functions', component: FunctionsComponent, canActivate: [authGuard]},
    { path: 'functions/:id', component: FunctionTesterComponent, canActivate: [authGuard]}
  ];
