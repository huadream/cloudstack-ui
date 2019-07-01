import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
const debounce = require('lodash/debounce');
import * as moment from 'moment';

import { State, UserTagsSelectors } from '../../root-store';
import * as usageAction from '../redux/usageRecords.actions';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import * as fromUsages from '../redux/usageRecords.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../shared/services/auth.service';
import { MatTabChangeEvent } from '@angular/material';

const FILTER_KEY = 'usageListFilters';

@Component({
  selector: 'cs-usage-list-container',
  template: `
    <cs-usage-list
      [usages]="usages$ | async"
      [isLoading]="loading$ | async"
      [firstDayOfWeek]="firstDayOfWeek$ | async"
      [usageTypes]="usageTypes$ | async"
      [selectedLevels]="selectedLevels$ | async"
      [selectedTypes]="selectedTypes$ | async"
      [date]="date$ | async"
      [query]="query$ | async"
      [accounts]="accounts$ | async"
      [isAdmin]="isAdmin()"
      [selectedAccountIds]="selectedAccountIds$ | async"
      (accountChanged)="onAccountChange($event)"
      (dateChange)="onDateChange($event)"
      (queryChanged)="onQueryChange($event)"
      (usageTypesChanged)="onUsageTypesChange($event)"
      (selectedLevelsChanged)="onSelectedLevelsChange($event)"
    ></cs-usage-list>
  `,
})
export class UsageListContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly usages$ = this.store.pipe(select(fromUsages.selectFilteredUsageRecords));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly query$ = this.store.pipe(select(fromUsages.filterQuery));
  readonly loading$ = this.store.pipe(select(fromUsages.isLoading));
  readonly filters$ = this.store.pipe(select(fromUsages.filters));
  readonly selectedTypes$ = this.store.pipe(select(fromUsages.filterSelectedTypes));
  readonly selectedLevels$ = this.store.pipe(select(fromUsages.filterSelectedLevels));
  readonly selectedAccountIds$ = this.store.pipe(select(fromUsages.filterSelectedAccountIds));
  readonly usageTypes$ = this.store.pipe(
    select(fromUsages.usageTypes),
    withLatestFrom(this.selectedTypes$),
    map(([all, selected]) => {
      const set = new Set(all.concat(selected));
      return [...Array.from(set)];
    }),
  );
  readonly date$ = this.store.pipe(select(fromUsages.filterDate));

  public levels = ['INFO', 'WARN', 'ERROR'];

  private filterService = new FilterService(
    {
      date: { type: 'string' },
      levels: { type: 'array', options: this.levels, defaultOption: [] },
      types: { type: 'array', defaultOption: [] },
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

  public onUsageTypesChange(selectedTypes: string[]) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ selectedTypes }));
  }

  public onSelectedLevelsChange(selectedLevels: string[]) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ selectedLevels }));
  }

  public onAccountChange(selectedAccountIds: string[]) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ selectedAccountIds }));
  }

  public onDateChange(date: Date) {
    this.store.dispatch(new usageAction.UsageFilterUpdate({ date }));
  }

  public ngOnInit() {
    this.initFilters();
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.filterService.update({
        date: moment(filters.date).format('YYYY-MM-DD'),
        levels: filters.selectedLevels,
        types: filters.selectedTypes,
        accounts: filters.selectedAccountIds,
        query: filters.query,
      });
    });
  }

  private initFilters(): void {
    const params = this.filterService.getParams();

    const date = moment(params['date']).toDate();
    const selectedLevels = params['levels'];
    const selectedTypes = params['types'];
    const query = params['query'];
    const selectedAccountIds = params['accounts'];

    this.store.dispatch(
      new usageAction.UsageFilterUpdate({
        query,
        date,
        selectedTypes,
        selectedLevels,
        selectedAccountIds,
      }),
    );
  }
}
