import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import {
  HouseClient,
  HouseModel,
  IHouseModel,
} from '../../services/whoIsParking-api.service';

@Component({
  selector: 'app-house-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './house-editor.component.html',
  styleUrl: './house-editor.component.scss',
})
export class HouseEditorComponent implements OnInit {
  public houseId = input<number>();

  public houseModel$?: Observable<IHouseModel>;

  private readonly houseClient = inject(HouseClient);

  public get defaultValue(): BehaviorSubject<IHouseModel> {
    return new BehaviorSubject<IHouseModel>({
      city: '',
      number: '',
      street: '',
      zip: 0,
      houseId: 0,
    });
  }

  public ngOnInit(): void {
    this.houseModel$ = this.houseId()
      ? this.houseClient.housesGET(this.houseId()!)
      : this.defaultValue;
  }

  public onSubmit(form: NgForm, houseModel: IHouseModel): void {
    const saveAction$: Observable<number | void> = houseModel.houseId
      ? this.houseClient.housesPUT(
          houseModel.houseId,
          new HouseModel(houseModel)
        )
      : this.houseClient.housesPOST(new HouseModel(houseModel));

    saveAction$.pipe(finalize(() => form.resetForm())).subscribe({
      error: (err) => {
        throw Error(err);
      },
    });
  }
}
