import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task';
import { JsonPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();

    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  });

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  changeHandler(event: Event) {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        this.addTask(value);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addTask(title: string) {
    const newTasks = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTasks]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((tasks, position) => position !== index)
    );
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  updadteTaskEditingMode(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  updadteTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false,
          };
        }
        return task;
      });
    });
  }

  constructor() {}

  injector = inject(Injector);

  ngOnInit(): void {
    const storange = localStorage.getItem('tasks');
    if (storange) {
      const tasks = JSON.parse(storange);
      this.tasks.set(tasks);
    }

    this.trackTasks();
  }

  trackTasks() {
    effect(
      () => {
        const tasks = this.tasks();
        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      { injector: this.injector }
    );
  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
