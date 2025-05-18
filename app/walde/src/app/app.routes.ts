import { Routes } from '@angular/router';
import { BuildComponent } from './build/build.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'build/:id', component: BuildComponent }
  ];
