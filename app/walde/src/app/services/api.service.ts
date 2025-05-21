import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CloudFunction } from '../model/function.model';

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

  rebuildBuild(id: string) {
    return this.http.post(`${environment.apiUrl}/api/build/${id}/rebuild`, {});
  }

  getFunctions() {
    return this.http.get<CloudFunction[]>(`${environment.apiUrl}/api/functions`);
  }
  
  createFunction(payload: {
    name: string;
    description?: string;
    code: string;
  }) {
    return this.http.post(`${environment.apiUrl}/api/functions`, payload);
  }
  
  invokeFunction(id: string, input: any) {
    return this.http.post(`${environment.apiUrl}/functions/${id}/invoke`, { input });
  }
  
}
