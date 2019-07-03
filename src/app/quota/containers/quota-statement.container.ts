import { Component, OnInit } from '@angular/core';

import { State, UserTagsSelectors } from '../../root-store';
import { AuthService } from '../../shared/services/auth.service';
import { select, Store } from '@ngrx/store';
import * as quotaStatementActions from '../../quota/redux/quota-statement/quota-statement.actions';
import * as fromQuota from '../../quota/redux/quota-statement/quota-statement.reducers';
import { DatePeriod } from '../../shared/interfaces';
import { formatIso } from '../../shared/components/date-picker/dateUtils';

export interface PeriodicElement {
  detail: string;
  action: string;
}

@Component({
  selector: 'cs-quota-statement',
  templateUrl: './quota-statement.container.html',
  styleUrls: ['./quota-statement.container.scss'],
})
export class QuotaStatementContainerComponent implements OnInit {
  readonly quotaStatement$ = this.store.pipe(select(fromQuota.selectAll));
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly isLoading$ = this.store.pipe(select(fromQuota.isLoading));

  constructor(private auth: AuthService, private store: Store<State>) {}

  ngOnInit(): void {
    this.store.dispatch(
      new quotaStatementActions.LoadQuotaStatementRequest({
        domainid: 1,
        account: 'admin',
        enddate: '2019-07-01',
        startdate: '2019-07-01',
      }),
    );
  }

  public onDateChange(date: DatePeriod) {
    this.store.dispatch(
      new quotaStatementActions.LoadQuotaStatementRequest({
        domainid: 1,
        account: 'admin',
        enddate: formatIso(date.toDate),
        startdate: formatIso(date.fromDate),
      }),
    );
  }
}
