import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {FhirSearchFn} from "@red-probeaufgabe/types";

@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {
  /** Implement Search Form */
  @Output() selectedFilter = new EventEmitter();
  @Output() searchString = new EventEmitter();
  searchForm: FormControl = new FormControl(null, Validators.pattern('[a-zA-Z0-9]*'));

  filters = [
    {name: 'Alle', function: FhirSearchFn.SearchAll},
    {name: 'Ärzte', function: FhirSearchFn.SearchPractitioners},
    {name: 'Patienten', function: FhirSearchFn.SearchPatients}
  ]

  constructor() {
  }

  ngOnInit() {
    this.searchForm.valueChanges.subscribe( term => {
      const s = this.searchForm.valid ? term : '';
      this.searchString.emit(s);
    })
  }
}
