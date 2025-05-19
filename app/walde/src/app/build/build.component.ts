import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-build',
  standalone: true,
  imports: [CommonModule, ProfileComponent],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css'
})
export class BuildComponent {
  buildId!: string;
  build: any;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.buildId = this.route.snapshot.paramMap.get('id')!;
    this.loadBuild();
  }

  loadBuild(): void {
    this.api.getBuildStatus(this.buildId).subscribe({
      next: (data) => this.build = data,
      error: (err) => console.error('Failed to load build', err)
    });
  }
}
