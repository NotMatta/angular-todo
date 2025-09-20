import { Component, signal } from '@angular/core';
import { Todo } from './todo/todo';

@Component({
  selector: 'app-root',
  imports: [Todo],
  template: `
    <div class="p-4 h-screen w-screen bg-[#121212] text-white flex justify-center items-center">
      <app-todo></app-todo>
    </div>
  `,
})
export class App {
  protected readonly title = signal('angular-todo');
}
