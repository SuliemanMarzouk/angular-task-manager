import { Component, computed, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService, Task } from '../../services/task-service';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  standalone: true,
})
export class TaskList {
  private readonly taskService = inject(TaskService);

  tasks: Signal<Task[]> = computed(() => this.taskService.tasks);
  openCount: Signal<number> = computed(() => this.taskService.openTasks().length);

  toggleComplete(task: Task): void {
    this.taskService.updateTask(task.id, { completed: !task.completed });
  }

  delete(task: Task): void {
    this.taskService.deleteTask(task.id);
  }
}
