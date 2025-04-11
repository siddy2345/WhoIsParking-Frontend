import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import {
  HouseClient,
  HouseViewModel,
  ParkedCarClient,
  ParkedCarSearchModel,
  ParkedCarViewModel,
} from '../services/whoIsParking-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParkedCarSearchModelFE } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  protected searchModel$ = new BehaviorSubject<ParkedCarSearchModelFE>({
    dateFrom: this.getDefaultDateFrom(),
    dateTo: this.getDefaultDateTo(),
  });

  protected houses$?: Observable<HouseViewModel[] | undefined>;

  protected cars$?: Observable<ParkedCarViewModel[] | undefined>;

  private readonly houseService = inject(HouseClient);
  private readonly parkedCarService = inject(ParkedCarClient);

  public ngOnInit(): void {
    this.houses$ = this.houseService
      .houseGet()
      .pipe(
        tap((h) =>
          this.searchModel$.next({
            ...this.searchModel$.value,
            houseId: h.at(0)?.houseId,
          })
        )
      );
  }

  public getDefaultDateFrom(): string {
    const currentDate = new Date();
    const unformattedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    return this.formatDate(unformattedDate);
  }
  public getDefaultDateTo(): string {
    const currentDate = new Date();
    const unformattedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    return this.formatDate(unformattedDate);
  }

  public onSearchCars(): void {
    const searchModel = this.searchModel$.value;
    this.cars$ = this.parkedCarService.search(
      new ParkedCarSearchModel({
        houseIds: [searchModel.houseId!],
        dateFrom: new Date(searchModel.dateFrom),
        dateTo: new Date(searchModel.dateTo),
      })
    );
  }

  public formatDate(date: Date): string {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split('T')[0];
  }

  public isSearchModelValid(): boolean {
    const searchModel = this.searchModel$.value;

    return (
      !isNaN(Date.parse(searchModel.dateFrom)) &&
      !isNaN(Date.parse(searchModel.dateTo)) &&
      searchModel.houseId !== undefined
    );
  }
}
