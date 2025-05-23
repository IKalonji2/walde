import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getWallets } from '@mysten/wallet-standard';
import { environment } from '../../environments/environment';
// import { SuiService } from '../services/sui.service';

@Injectable({
  providedIn: 'root'
})
export class WalletAuthService {
  private http = inject(HttpClient);

  walletAddress:any;
  availableWallets: any;

  constructor() {
    console.log("Wallet auth init");
    this.availableWallets = getWallets().get();
    console.log(this.availableWallets);
    
  }

  async login() {
    console.log("In Sui wallet connection step ", );

    if (this.availableWallets.length === 0) {
      alert("No Sui wallet detected");
      return this.walletAddress;
    } else {
      const wallet = this.availableWallets[0];
      wallet.features['standard:connect'].connect()
        .then((accounts:any) => {
          console.log('Wallet connected! ', accounts.accounts[0].address);
          this.walletAddress = accounts.accounts[0].address;

          this.http.post(
            `${environment.apiUrl}/api/auth/wallet-login`, {"wallet_address":this.walletAddress}
          ).subscribe({
            next: (data:any) => localStorage.setItem('walde_token', data.access_token),
            error: (err) => console.error('Error with wallet login', err)
          });

          return this.walletAddress;
        })
        .catch((err:any) => {
          console.error('Failed to connect:', err);
        });
        return this.walletAddress;
    }

  }

  async signTransaction(transaction: any): Promise<any> {
    // if (!this.sui) return null;

    // try {
    //   return await this.sui.signAndExecuteTransaction(transaction);
    // } catch (err) {
    //   console.error('Transaction signing failed:', err);
    //   return null;
    // }
    return null;
  }

}
