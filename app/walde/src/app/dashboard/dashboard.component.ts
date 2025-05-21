import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';
import { FunctionsComponent } from '../functions/functions.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProfileComponent, CommonModule, CreateProjectModalComponent, FunctionsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  profile: any;
  projects: any[] = [];

  activeTab: 'projects' | 'functions' = 'projects';

  showCreateModal = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loadProjects();
      },
      error: (err) => console.error('Failed to load profile', err)
    });
  }

  loadProjects(): void {
    this.api.getUserProjects().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Failed to load projects', err)
    });
  }

  goToBuild(buildId: string): void {
    this.router.navigate(['/build', buildId]);
  }

  createNewProject(): void {
    this.showCreateModal = true;
  }
}
