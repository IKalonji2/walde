import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { WalletAuthService } from './auth/wallet-auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);  
  const walletService = inject(WalletAuthService);
  const token = localStorage.getItem('walde_token');
  console.log("In auth guard", token) 
  if (!token || !walletService.walletAddress) {
      console.log("No token/wallet connected - Navigate home - Connect wallet");
      router.navigate(['/']);
      return false;
    }
  console.log(!token);
  return true;
};
