import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.css'
})
export class CreateProjectModalComponent {
  @Output() closeModal = new EventEmitter<void>();

  repositories: any[] = [];
  form = {
    appName: '',
    repo: '',
    branch: 'main',
    autoDeploy: true,
    outputDir: '/dist',
    buildCommand: 'npm run build'
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getUserRepos().subscribe({
      next: (repos) => this.repositories = repos,
      error: (err) => console.error('Failed to load repos', err)
    });
  }

  close(): void {
    this.closeModal.emit();
  }

  startBuild(): void {
    const buildRequest = {
      name: this.form.appName,
      repo: this.form.repo,
      branch: this.form.branch,
      auto_deploy: this.form.autoDeploy,
      build_command: this.form.buildCommand,
      output_dir: this.form.outputDir
    };

    this.api.createBuild(buildRequest).subscribe({
      next: (res: any) => {
        this.close();
        this.router.navigate(['/build', res.build_id]);
      },
      error: (err) => console.error('Build failed', err)
    });
  }
}
