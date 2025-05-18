import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WalletAuthService } from '../auth/wallet-auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private walletAuth: WalletAuthService, private router: Router) {}

  async getStarted() {
    console.log("getStarted() clicked");
    
    const address = await this.walletAuth.login();
    if (address) {
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please connect your wallet to continue.');
    }
  }
}
