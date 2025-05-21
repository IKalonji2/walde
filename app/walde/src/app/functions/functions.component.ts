import { Component, OnInit } from '@angular/core';
import { CloudFunction } from '../model/function.model';
import { ApiService } from '../services/api.service';
import { CreateFunctionModalComponent } from '../create-function-modal/create-function-modal.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-functions',
  standalone: true,
  imports: [CreateFunctionModalComponent, RouterModule, CommonModule],
  templateUrl: './functions.component.html',
  styleUrl: './functions.component.css'
})
export class FunctionsComponent implements OnInit{
  functions: CloudFunction[] = [];
  showModal = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadFunctions();
  }

  loadFunctions() {
    this.api.getFunctions().subscribe((fns) => {
      this.functions = fns;
    });
  }

  openModal() {
    this.showModal = true;
  }

  onCreated() {
    this.showModal = false;
    this.loadFunctions();
  }
}
