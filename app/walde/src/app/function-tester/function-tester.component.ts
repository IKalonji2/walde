import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-function-tester',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './function-tester.component.html',
  styleUrl: './function-tester.component.css'
})
export class FunctionTesterComponent {
  functionId!: string;
  input = '';
  result: any = null;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.functionId = this.route.snapshot.paramMap.get('id')!;
  }

  runTest() {
    this.result = null;
    this.error = null;
    this.api.invokeFunction(this.functionId, this.input).subscribe({
      next: (res:any) => this.result = res.result,
      error: (err) => this.error = err.error?.error || 'Execution failed'
    });
  }
}
