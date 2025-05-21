import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule, Location } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-build',
  standalone: true,
  imports: [CommonModule, ProfileComponent],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css'
})
export class BuildComponent implements OnInit, OnDestroy{
  buildId!: string;
  build: any;
  pollingSub!: Subscription;

  constructor(private route: ActivatedRoute, private api: ApiService, private location: Location) {}

  ngOnInit(): void {
    this.buildId = this.route.snapshot.paramMap.get('id')!;
    this.startPolling();;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  startPolling(): void {
    this.pollingSub = interval(5000).subscribe(() => {
      this.loadBuild();
    });
    this.loadBuild(); // initial load
  }

  stopPolling(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  loadBuild(): void {
    this.api.getBuildStatus(this.buildId).subscribe({
      next: (data:any) => {
        this.build = data;

        if (data.status === 'success' || data.status === 'failed' || data.status === 'deployed') {
          this.stopPolling();
        }
      },
      error: (err) => {
        console.error('Failed to load build', err);
      }
    });
  }

  rebuild(): void {
    this.api.rebuildBuild(this.buildId).subscribe({
      next: () => {
        this.build.status = 'queued';
        this.build.log = '';
        this.startPolling();
      },
      error: (err) => console.error('Rebuild failed', err)
    });
  }

  goBack() {
    this.location.back();
  }
}
