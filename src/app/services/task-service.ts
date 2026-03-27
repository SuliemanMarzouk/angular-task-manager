import { Injectable, computed, signal, Signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // 1) Single source of truth: signal-based in-memory task list
  private readonly _tasks = signal<Task[]>([
    { id: 1, title: 'Plan sprint', description: 'Define scope for next week', dueDate: '2026-04-02', completed: false },
    { id: 2, title: 'Review PRs', description: 'Finish code review for feature branch', dueDate: '2026-04-01', completed: true },
    { id: 3, title: 'Team meeting', description: 'Discuss blockers and demos', dueDate: '2026-04-03', completed: false },
  ]);

  // 2) Computed values (derived state)
  tasksCount: Signal<number> = computed(() => this._tasks().length);

  openTasks: Signal<Task[]> = computed(() => this._tasks().filter(task => !task.completed));

  get tasks(): Task[] {
    return this._tasks();
  }

  getTask(id: number): Task | undefined {
    return this._tasks().find(task => task.id === id);
  }

  addTask(task: Omit<Task, 'id'>): void {
    const nextId = Math.max(0, ...this._tasks().map(t => t.id)) + 1;
    this._tasks.update(tasks => [...tasks, { id: nextId, ...task }]);
  }

  updateTask(id: number, updates: Partial<Omit<Task, 'id'>>): void {
    this._tasks.update(tasks =>
      tasks.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  }

  deleteTask(id: number): void {
    this._tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  /**
   * Example: if I have an API endpoint
   *
   * constructor(private http: HttpClient) {}
   *
   * loadTasksFromApi(): Observable<Task[]> {
   *   return this.http.get<Task[]>('/api/tasks').pipe(
   *     tap(serverTasks => this._tasks.set(serverTasks))
   *   );
   * }
   *
   * Then the component can subscribe or transform with signals:
   * this.taskService.loadTasksFromApi().subscribe();
   */
  // (No active HttpClient dependency so this file remains runnable for local demo setup.)
}
