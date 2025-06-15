import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HouseClient,
  HouseViewModel,
  IHouseViewModel,
} from '../../services/whoIsParking-api.service';
import { QRCodeComponent } from 'angularx-qrcode';
import jsPDF from 'jspdf';
import { PARKED_CAR_ROUTE } from '../../app.models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-house-detail',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './house-detail.component.html',
  styleUrl: './house-detail.component.scss',
})
export class HouseDetailComponent implements OnInit {
  public houses$!: Observable<HouseViewModel[]>;
  public qrCodeData = signal('');
  public openDialog = signal(false);
  public selectedHouse = signal<IHouseViewModel>({});

  private readonly houseService = inject(HouseClient);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.houses$ = this.houseService.housesAll();
  }

  public onSelectHouse(house: HouseViewModel): void {
    this.selectedHouse.set(house);
  }

  public onGenerateQrCode(houseId: number): void {
    this.qrCodeData.set(
      `${window.location.origin}/${PARKED_CAR_ROUTE}/${houseId}`
    );
    this.openDialog.set(true);
    this.renderer.addClass(document.body, 'dialog-backdrop');
  }

  public onEditHouse(houseId: number): void {
    this.router.navigate(['/house/editor', houseId]);
  }

  public onCloseDialog(): void {
    this.openDialog.set(false);
    this.renderer.removeClass(document.body, 'dialog-backdrop');
  }

  public onDownloadPdf(qrCode: QRCodeComponent): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const canvas = qrCode.qrcElement.nativeElement as HTMLDivElement;
    const canvasUrl = canvas.querySelector('canvas')?.toDataURL('image/png');
    if (!canvasUrl) {
      throw Error('canvas url undefined'); //FIXME: error handling
    }

    const imgWidth = 208;
    const imgHeight = (canvas.clientHeight * imgWidth) / canvas.clientWidth;

    doc.setFontSize(25);
    doc.text(
      `${this.selectedHouse().street} ${this.selectedHouse().number}`,
      10,
      15
    );

    doc.addImage(canvasUrl!, 'PNG', 0, 25, imgWidth, imgHeight);

    doc.save(
      `HausQrCode_${this.selectedHouse().street}_${
        this.selectedHouse().number
      }.pdf`
    );
  }
}
