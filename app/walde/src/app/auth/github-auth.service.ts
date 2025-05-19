import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubAuthService {

  redirectToGithubOAuth() {
    window.location.href = 'http://localhost:5000/api/github/login';
  }
}
