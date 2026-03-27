import { Component, computed, inject, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task-service';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
  standalone: true,
})
export class TaskDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);

  taskId: number = Number(this.route.snapshot.paramMap.get('id')) || 0;

  private currentTask = signal<Task | undefined>(undefined);

  constructor() {
    this.loadTask();
  }

  private loadTask(): void {
    this.currentTask.set(this.taskService.getTask(this.taskId));
  }

  get task(): Task | undefined {
    return this.currentTask();
  }

  get taskNotFound(): boolean {
    return !this.task;
  }

  taskStatus: Signal<string> = computed(() =>
    this.task?.completed ? 'Completed' : 'Pending'
  );

  toggleComplete(): void {
    const task = this.task;
    if (!task) return;
    this.taskService.updateTask(task.id, { completed: !task.completed });
    this.loadTask();
  }

  deleteTask(): void {
    const task = this.task;
    if (!task) return;
    this.taskService.deleteTask(task.id);
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
