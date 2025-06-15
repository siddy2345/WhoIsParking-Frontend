import { Component, inject, input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  IParkedCarModel,
  ParkedCarClient,
  ParkedCarModel,
} from '../services/whoIsParking-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parked-car',
  imports: [FormsModule, CommonModule],
  templateUrl: './parked-car.component.html',
  styleUrl: './parked-car.component.scss',
})
export class ParkedCarComponent {
  /** Input from url param */
  public houseId = input.required<number>();

  public parkedCarModel$ = new BehaviorSubject<IParkedCarModel>(
    this.defaultValues
  );

  private get defaultValues(): IParkedCarModel {
    return {
      timeZoneInfo: Intl.DateTimeFormat().resolvedOptions().timeZone,
    } as IParkedCarModel;
  }

  private readonly carClient = inject(ParkedCarClient);

  public onSubmit(form: NgForm): void {
    const car = this.parkedCarModel$.value;
    const date = new Date(this.parkedCarModel$.value.arrival);

    if (!car || form.invalid) throw Error('Car model not defined'); //FIXME: error handling
    this.carClient
      .parkedCars(
        new ParkedCarModel({ ...car, arrival: date, houseId: this.houseId()! })
      )
      .subscribe({
        next: () => {
          form.reset();
        },
        error: (err) => {
          throw Error(err);
        },
      });
  }
}
