import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubAuthService {

  redirectToGithubOAuth() {
    const token = localStorage.getItem('walde_token');
    window.location.href = `${environment.apiUrl}/api/github/login?token=${token}`;
  }
}
