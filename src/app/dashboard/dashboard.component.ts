import {Component} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import { FhirSearchFn, IFhirPatient, IFhirPractitioner, IFhirSearchResponse } from '@red-probeaufgabe/types';
import { IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { SearchFacadeService } from '@red-probeaufgabe/search';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;

  /*
   * Implement search on keyword or fhirSearchFn change
   **/

  searchType: FhirSearchFn = FhirSearchFn.SearchAll;
  searchQuery = '';
  applySearch = new BehaviorSubject<any>({type: this.searchType, query: this.searchQuery});
  setQuery($event) {
    this.searchQuery = $event;
    console.log($event);
    this.applySearch.next({type: this.searchType, query: this.searchQuery});
  }
  setFilter($event) {
    this.searchType = $event;
    console.log($event);
    this.applySearch.next({type: this.searchType, query: this.searchQuery});
  }

  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> = this.applySearch.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((searchMap: any) => this.searchFacade
          .search(searchMap.type, searchMap.query)
          .pipe(
              catchError(this.handleError),
              tap((data) => {
                this.isLoading = false;
              }),
              shareReplay(),
          )
      ),
  );

  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>> = this.search$.pipe(
    map((data) => !!data && data.entry),
    startWith([]),
  );

  totalLength$ = this.search$.pipe(
    map((data) => !!data && data.total),
    startWith(0),
  );

  constructor(private siteTitleService: SiteTitleService, private searchFacade: SearchFacadeService) {
    this.siteTitleService.setSiteTitle('Dashboard');
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
