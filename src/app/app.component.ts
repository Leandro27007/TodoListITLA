import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LocalStorageService} from './repository/local-storage.service';
import {Task} from './ITask';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSlideToggleModule, CommonModule, DragDropModule, FormsModule, CdkDropList, CdkDrag],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tasks: Task[] = [];
  completedTasks: Task[] = [];
  newTask: string = '';
  newTaskDueDate: string = '';
  newTaskDescripcion: string = '';
  pendingStorageKey = 'tasks';
  completedStorageKey = 'completedTasks';

  constructor(private localStorageService: LocalStorageService<Task>) {
  }

  ngOnInit(): void {
    const storedTasks = this.localStorageService.getItem(this.pendingStorageKey);
    const storedCompletedTasks = this.localStorageService.getItem(this.completedStorageKey);

    if (storedTasks) {
      this.tasks = storedTasks;
    }
    if (storedCompletedTasks) {
      this.completedTasks = storedCompletedTasks;
    }
  }

  addTask(): void {
    if (this.newTask.trim() && this.newTaskDueDate && this.newTaskDescripcion.trim()) {
      this.tasks.push({name: this.newTask, dueDate: new Date(this.newTaskDueDate), descripcion: this.newTaskDescripcion});
      this.newTask = '';
      this.newTaskDueDate = '';
      this.updateLocalStorage();
    }
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateLocalStorage();
  }


  private updateLocalStorage(): void {
    this.localStorageService.setItem(this.pendingStorageKey, this.tasks);
    this.localStorageService.setItem(this.completedStorageKey, this.completedTasks);
  }

  dropTask(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (event.container.id === 'deletedList') {
      this.deleteTask(event.previousIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateLocalStorage();
  }

  deleteTask(index: number): void {
    this.tasks.splice(index, 1);
    this.updateLocalStorage();
  }
}
