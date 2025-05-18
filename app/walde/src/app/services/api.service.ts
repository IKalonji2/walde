import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

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
}
