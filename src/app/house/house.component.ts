import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_BASE_URL,
  HouseClient,
  HouseViewModel,
} from '../services/whoIsParking-api.service';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-house',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './house.component.html',
  styleUrl: './house.component.scss',
})
export class HouseComponent implements OnInit {
  public houses$!: Observable<HouseViewModel[]>;
  public qrCodeDataSig = signal('');
  public openDialog = signal(false);

  private readonly houseService = inject(HouseClient);
  private readonly renderer = inject(Renderer2);

  public ngOnInit(): void {
    this.houses$ = this.houseService.housesGetAdmin();
  }

  public onGenerateQrCode(houseId: number): void {
    this.qrCodeDataSig.set(`${houseId}`); //TODO: route of car creation with houseId as url param
    this.openDialog.set(true);
    this.renderer.addClass(document.body, 'dialog-backdrop');
  }

  public onCloseDialog(): void {
    this.openDialog.set(false);
    this.renderer.removeClass(document.body, 'dialog-backdrop');
  }
}
