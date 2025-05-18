import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubAuthService {

  private clientId = 'YOUR_GITHUB_CLIENT_ID';

  redirectToGithubOAuth() {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&scope=repo`;
  }
}
