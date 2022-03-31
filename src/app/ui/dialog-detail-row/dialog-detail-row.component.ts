import {Component, Inject, Input} from '@angular/core';
import {IFhirPatient, IFhirPractitioner} from "@red-probeaufgabe/types";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-detail-row',
  templateUrl: './dialog-detail-row.component.html',
  styleUrls: ['./dialog-detail-row.component.scss'],
})
export class DialogDetailRowComponent {
  @Input() label = '';
  // @Input() data: IFhirPatient | IFhirPractitioner;

  detailRows: any[];

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: IFhirPatient | IFhirPractitioner) {
  }
  ngOnInit() {
    this.setData();
  }

  setData() {
    this.data.resourceType === 'Patient' ? this.setPatientData() : this.setPracticinerData();
  }

  setPatientData() {
    this.detailRows = [
      {label: 'Ressource Type', data: this.data.resourceType},
      {label: 'Name', data: this.data.name[0].family},
      {label: 'ID', data: this.data.id},
      {label: 'Geburtstag', data: this.data.birthDate},
      {label: 'Gender', data: this.data.gender},
      {label: 'Adresse', data: this.data.address}
    ]
  }

  setPracticinerData() {
    this.detailRows = [
      {label: 'Ressource Type', data: this.data.resourceType},
      {label: 'Name', data: this.data.name[0].family},
      {label: 'ID', data: this.data.id},
      {label: 'Telecom', data: this.data.telecom}
    ]
  }
}
