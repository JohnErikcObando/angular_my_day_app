import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css',
})
export class LabsComponent {
  title = 'Labs';
  tasks = signal([
    'Instalar el angular CLI',
    'Crear Proyecto',
    'Crear Componente',
    'Crear Servicios',
  ]);

  name = signal('John Erikc');
  age = 34;
  desabled = true;
  img = 'https://www.w3schools.com/howto/img_avatar.png';

  person = signal({
    name: 'John',
    age: 34,
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  });

  colorCtrl = new FormControl();
  widtgCtrl = new FormControl(50, {
    nonNullable: true,
  });
  nameCtrl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor() {
    this.colorCtrl.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  clickHandler() {
    alert('Hola');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
  }

  keydownHanler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update((prevState) => {
      return {
        ...prevState,
        age: parseInt(newValue, 10),
      };
    });
  }

  changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update((prevState) => {
      return {
        ...prevState,
        name: newValue,
      };
    });
  }
}
