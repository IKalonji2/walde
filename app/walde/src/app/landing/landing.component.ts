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
  imgPath = "../../assets/walde_cloud.png"
  constructor(private walletAuth: WalletAuthService, private router: Router) {}

  async getStarted() {
    console.log("getStarted() clicked");
    await this.walletAuth.login().then(address =>{
      console.log("address: ", address);
      if (address) {
        this.router.navigate(['/dashboard']);
      } 
      // else {
      //   alert('Please connect your wallet to continue.');
      // } 
    });
    
    
  }
}
