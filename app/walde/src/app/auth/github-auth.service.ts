import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubAuthService {

  redirectToGithubOAuth() {
    window.location.href = `${environment.apiUrl}/api/github/login`;
  }
}
