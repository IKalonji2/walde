import { Component, OnInit} from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { GithubAuthService } from '../auth/github-auth.service';
import { WalletAuthService } from '../auth/wallet-auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profile: any;
  walletAddress: any;
  constructor(private api: ApiService, private githubLogin: GithubAuthService, private walletAuth: WalletAuthService) {}

  ngOnInit() {
    this.walletAddress = this.walletAuth.walletAddress;
    this.api.getProfile().subscribe({
      next: (data) => this.profile = data,
      error: (err) => console.error('Error fetching profile', err)
    });
  }

  connectGithub() {
    this.githubLogin.redirectToGithubOAuth();
  }
}
