import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'nb-post-edit',
  imports: [CommonModule],
  template: `
    <h1>Post Editor</h1>
    <p>Stub editor screen (restricted to EDITOR/ADMIN). Implement form later.</p>
  `,
})
export class PostEditComponent {}
