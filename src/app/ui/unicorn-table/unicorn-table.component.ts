import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IUnicornTableColumn } from '../models';
import { IFhirPatient, IFhirPractitioner } from '@red-probeaufgabe/types';
import {MatDialog} from "@angular/material/dialog";
import {DialogDetailRowComponent} from "../dialog-detail-row/dialog-detail-row.component";

@Component({
  selector: 'app-unicorn-table',
  templateUrl: './unicorn-table.component.html',
  styleUrls: ['./unicorn-table.component.scss'],
})
export class UnicornTableComponent implements OnInit {
  dataSource: MatTableDataSource<IFhirPatient | IFhirPractitioner> = new MatTableDataSource([]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>();
  @Input() totalLength = 0;
  @Input() isLoading = false;

  @Input()
  set entries(value: Array<IFhirPatient | IFhirPractitioner>) {
    this.dataSource.data = value;
  }

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  openDialog(row: IFhirPatient | IFhirPractitioner): void {
    const dialogRef = this.dialog.open(DialogDetailRowComponent, {
      data: row,
    });
    console.log(row)
    // dialogRef.componentInstance.label = row.resourceType;
  }
}
