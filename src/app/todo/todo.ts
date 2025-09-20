import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from "@angular/forms"

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

// task
@Component({
  selector: 'app-todo-task',
  template: `
    <div class="p-4 px-2 rounded-lg flex justify-between items-center group hover:bg-white/5">
      <div class="flex items-center gap-2 select-none">
        <div class="relative flex items-center justify-center">
          <input type="checkbox" class="rounded-full border border-white/20 checked:text-black w-5 h-5 appearance-none checked:border-0 z-10" [checked]="task.completed" (change)="onToggle()"/>
          <p class="absolute w-5 h-5 left-0 top-0 text-black bg-white rounded-full flex items-center justify-center" [class]="{'visible': task.completed, 'hidden': !task.completed}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg></p>
        </div>
        <p [class]="{'line-through': task.completed}">{{task.title}}</p>
      </div>
      <div class="space-x-2">
        <button class="p-2 opacity-0 rounded-xl hover:bg-white/10 group-hover:opacity-100" (click)="onEdit()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-icon lucide-pen"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
        </button>
        <button class="p-2 opacity-0 rounded-xl hover:bg-white/10 hover:text-red-300 group-hover:opacity-100" (click)="onRemove()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `
})
export class Task {
  @Input() task!: TodoItem;
  @Output() toggle =  new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  onToggle(){
    this.toggle.emit(this.task.id)
  }

  onEdit(){
    this.edit.emit(this.task.id)
  }

  onRemove(){
    this.remove.emit(this.task.id)
  }
}

//popup
@Component({
  selector: "app-todo-edit-popup",
  imports: [FormsModule],
  template: `
    <div class="flex justify-center items-center absolute top-0 left-0 w-screen h-screen">
      <div class="bg-black/50 absolute top-0 left-0 w-screen h-screen z-20" (click)="onCancel()"></div>
      <div class="bg-[#121212] rounded-lg z-30 p-4 w-[500px] space-y-4">
        <h2 class="mb-4 font-bold text-xl">Update Task Title</h2>
        <input class="border border-white/30 focus-visible:outline-none p-2 rounded-lg w-full placeholder:text-white/30" [(ngModel)]="input" placeholder="Type a new title" (keyup.enter)="onEdit()"/>
        <div class="flex justify-end gap-2">
          <button class="p-2 rounded-lg border border-white/10 hover:bg-white/5" (click)="onCancel()">Cancel</button>
          <button class="p-2 bg-white hover:bg-white/90 text-black rounded-lg" (click)="onEdit()">Apply Edit</button>
        </div>
      </div>
    </div>
  `
})
export class EditPopUp{
  @Input() input! : string;
  @Output() cancel = new EventEmitter()
  @Output() edit = new EventEmitter<string>()

  onCancel(){
    this.cancel.emit()
  }
  onEdit(){
    this.edit.emit(this.input)
  }
}

//main
@Component({
  selector: 'app-todo',
  imports: [Task, FormsModule,EditPopUp],
  template: `
    <div class="flex flex-col border border-white/30 max-h-[500px] w-[400px] h-screen rounded-md">
      @if(editingId != null){
        <app-todo-edit-popup (cancel)="cancelEditing()" (edit)="editTask($event)" [input]="editingTitle"></app-todo-edit-popup>
      }
      <div class="flex flex-col gap-4 grow max-h-full overflow-scroll p-4">
        @for (item of todos; track item.id) {
          <app-todo-task [task]="item" (toggle)="toggleTask($event)" (edit)="setEditing($event)" (remove)="removeTask($event)"></app-todo-task>
        }
        @if (todos.length == 0){
          <p class="w-full text-center text-white/50">Start by adding new tasks</p>
        }
      </div>
      <div class="flex gap-2 p-4">
        <input class="border border-white/30 focus-visible:outline-none p-2 rounded-lg grow placeholder:text-white/50" [(ngModel)]="input" (keyup.enter)="addTask()" placeholder="Add a new task.."/>
        <button class="p-2 bg-white text-black rounded-lg" (click)="addTask()">Add Task</button>
      </div>
    </div>
  `,
})

export class Todo {
  protected todos : TodoItem[] = [
  ]
  protected input = ""
  protected editingId : number | null = null
  protected editingTitle = ""

  protected addTask(){
    if(this.input.trim()){
      this.todos.push({id: this.todos.length, title: this.input, completed: false});
      this.input = ""
    }
  }

  protected removeTask(id: number){
    this.todos = this.todos.filter(t => t.id !== id);
  }

  protected toggleTask(id: number){
    const task = this.todos[id];
    if(task){
      task.completed = !task.completed;
    }
  }

  protected setEditing(id: number){
    this.editingId = id;
    this.editingTitle = this.todos[id]!.title;
  }

  protected cancelEditing(){
    this.editingId = null;
    this.editingTitle = "";
  }

  protected editTask(title: string){
    if(title == this.editingTitle){
      return
    }
    const task = this.todos[this.editingId!];
    if(task){
      task.title = title;
    }
    this.cancelEditing();
  }
}
