import { Component, computed, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
  standalone: true,
})
export class TaskForm {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  title = signal('');
  description = signal('');
  dueDate = signal('');
  completed = signal(false);

  isFormValid: Signal<boolean> = computed(() =>
    Boolean(this.title().trim() && this.description().trim() && this.dueDate())
  );

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.taskService.addTask({
      title: this.title().trim(),
      description: this.description().trim(),
      dueDate: this.dueDate(),
      completed: this.completed(),
    });

    this.router.navigate(['/']);
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
