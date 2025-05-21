import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-function-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-function-modal.component.html',
  styleUrl: './create-function-modal.component.css'
})
export class CreateFunctionModalComponent {
  @Output() close = new EventEmitter<void>();

  name = '';
  description = '';
  code = `def run(input):\n    return input`;

  constructor(private api: ApiService) {}

  submit() {
    this.api.createFunction({
      name: this.name,
      description: this.description,
      code: this.code
    }).subscribe(() => this.close.emit());
  }
}
