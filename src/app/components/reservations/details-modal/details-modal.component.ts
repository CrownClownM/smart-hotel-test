import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { ModalModule } from 'logical-growth-components';
import { TitleComponent } from "../../shared/title/title.component";
import { reservationsData } from '@interfaces/reservations/reservations.interface';
import { ParagraphComponent } from "../../shared/paragraph/paragraph.component";
import { LoaderComponent } from "../../shared/loader/loader.component";
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-details-modal',
  imports: [ModalModule, TitleComponent, ParagraphComponent, LoaderComponent, TitleCasePipe],
  templateUrl: './details-modal.component.html'
})
export class DetailsModalComponent {

  public reservationData: reservationsData | null = null;

  constructor(
    @Inject(DIALOG_DATA) public data: {
      item: reservationsData
  }){
    this.reservationData = data.item;
  }

}
