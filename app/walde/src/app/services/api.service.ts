import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  constructor() {}

  getProfile() {
    return this.http.get(`${environment.apiUrl}/api/user`);
  }

  linkGithub(code: string) {
    return this.http.post(`${environment.apiUrl}/api/github/callback`, { code });
  }

  createBuild(data: any) {
    return this.http.post(`${environment.apiUrl}/api/build`, data);
  }

  getBuildStatus(id: string) {
    return this.http.get(`${environment.apiUrl}/api/build/${id}`);
  }

  getUserProjects() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/user/projects`);
  }

  getUserRepos() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/github/repos`);
  }
}
