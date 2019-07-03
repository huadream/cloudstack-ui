import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
const debounce = require('lodash/debounce');
import * as moment from 'moment';

import { State, UserTagsSelectors } from '../../root-store';
import * as usageAction from '../redux/usage-records.actions';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import * as fromUsages from '../redux/usage-records.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../shared/services/auth.service';
import { DatePeriod } from '../../shared/interfaces';

const FILTER_KEY = 'usageListFilters';

@Component({
  selector: 'cs-usage-records-container',
  template: `
    <cs-usage-list
      [usages]="usages$ | async"
      [isLoading]="loading$ | async"
      [firstDayOfWeek]="firstDayOfWeek$ | async"
      [date]="date$ | async"
      [query]="query$ | async"
      [accounts]="accounts$ | async"
      [isAdmin]="isAdmin()"
      [selectedClass]="selectedClass$ | async"
      [selectedAccountIds]="selectedAccountIds$ | async"
      (accountChanged)="onAccountChange($event)"
      (dateChange)="onDateChange($event)"
      (queryChanged)="onQueryChange($event)"
      (selectedClassChange)="onSelectedClassChange($event)"
    ></cs-usage-list>
  `,
})
export class UsageRecordsContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly usages$ = this.store.pipe(select(fromUsages.selectFilteredUsageRecords));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly query$ = this.store.pipe(select(fromUsages.filterQuery));
  readonly loading$ = this.store.pipe(select(fromUsages.isLoading));
  readonly filters$ = this.store.pipe(select(fromUsages.filters));
  readonly selectedClass$ = this.store.pipe(select(fromUsages.filterSelectedClass));
  readonly selectedAccountIds$ = this.store.pipe(select(fromUsages.filterSelectedAccountIds));

  readonly date$ = this.store.pipe(select(fromUsages.filterDate));

  private filterService = new FilterService(
    {
      fromDate: { type: 'string' },
      toDate: { type: 'string' },
      class: { type: 'string' },
      accounts: { type: 'array', defaultOption: [] },
      query: { type: 'string' },
    },
    this.router,
    this.sessionStorage,
    FILTER_KEY,
    this.activatedRoute,
  );

  constructor(
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    super();

    this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public onQueryChange(query: string) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ query }));
  }

  public onSelectedClassChange(selectedClass: number) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ selectedClass }));
  }

  public onAccountChange(selectedAccountIds: string[]) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ selectedAccountIds }));
  }

  public onDateChange(date: DatePeriod) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ date }));
  }

  public ngOnInit() {
    this.initFilters();
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.filterService.update({
        fromDate: moment(filters.date.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filters.date.toDate).format('YYYY-MM-DD'),
        class: filters.selectedClass,
        accounts: filters.selectedAccountIds,
        query: filters.query,
      });
    });
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const date = {
      fromDate: moment(params['fromDate']).toDate(),
      toDate: moment(params['toDate']).toDate(),
    };
    const selectedClass = parseInt(params['class'], 10);
    const query = params['query'];
    const selectedAccountIds = params['accounts'];

    this.store.dispatch(
      new usageAction.UsageFilterUpdate({
        query,
        date,
        selectedClass,
        selectedAccountIds,
      }),
    );
  }
}
