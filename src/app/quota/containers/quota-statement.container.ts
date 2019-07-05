import { Component, OnInit } from '@angular/core';

import { State, UserTagsSelectors } from '../../root-store';
import { AuthService } from '../../shared/services/auth.service';
import { select, Store } from '@ngrx/store';
import * as quotaStatementActions from '../../quota/redux/quota-statement/quota-statement.actions';
import * as fromQuota from '../../quota/redux/quota-statement/quota-statement.reducers';
import { DatePeriod } from '../../shared/interfaces';
import { formatIso } from '../../shared/components/date-picker/dateUtils';
import { takeUntil } from 'rxjs/operators';
import { Account } from '../../shared/models/account.model';
import * as moment from 'moment';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';

const FILTER_KEY = 'quotaStatementFilters';

@Component({
  selector: 'cs-quota-statement',
  templateUrl: './quota-statement.container.html',
  styleUrls: ['./quota-statement.container.scss'],
})
export class QuotaStatementContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly quotaStatement$ = this.store.pipe(select(fromQuota.selectAll));
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly isLoading$ = this.store.pipe(select(fromQuota.isLoading));
  readonly filters$ = this.store.pipe(select(fromQuota.filters));
  readonly date$ = this.store.pipe(select(fromQuota.filterDate));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly account$ = this.store.pipe(select(fromAccounts.getSelectedAccount));
  readonly selectedAccountId$ = this.store.pipe(select(fromAccounts.getSelectedId));

  public account: Account;

  private filterService = new FilterService(
    {
      fromDate: { type: 'string' },
      toDate: { type: 'string' },
      account: { type: 'string', defaultOption: this.auth.user.accountid },
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
    private auth: AuthService,
  ) {
    super();
  }

  public isAdmin() {
    return this.auth.isAdmin();
  }

  public ngOnInit() {
    this.initFilters();
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.filterService.update({
        fromDate: moment(filters.date.fromDate).format('YYYY-MM-DD'),
        toDate: moment(filters.date.toDate).format('YYYY-MM-DD'),
      });
    });

    this.selectedAccountId$.pipe(takeUntil(this.unsubscribe$)).subscribe(selectedAccountId => {
      this.filterService.update({
        account: selectedAccountId,
      });
    });
    this.account$.pipe(takeUntil(this.unsubscribe$)).subscribe(account => {
      this.account = account;
    });
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const date = {
      fromDate: moment(params['fromDate']).toDate(),
      toDate: moment(params['toDate']).toDate(),
    };
    this.onAccountChange(params['account']);
    this.onDateChange(date);
  }

  private onAccountChange(selectedAccountId: string) {
    this.store.dispatch(new accountActions.LoadSelectedAccount(selectedAccountId));
  }

  private onDateChange(date: DatePeriod) {
    this.store.dispatch(
      new quotaStatementActions.LoadQuotaStatementRequest({
        domainid: this.account ? this.account.domainid : this.auth.user.domainid,
        account: this.account ? this.account.name : this.auth.user.account,
        enddate: formatIso(date.toDate),
        startdate: formatIso(date.fromDate),
      }),
    );
  }
}
