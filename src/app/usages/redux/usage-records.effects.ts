import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import * as usage from './usage-records.actions';
import { UsageService } from '../usage.service';
import { UsageRecord } from '../usage-record.model';
import { formatIso } from '../../shared/components/date-picker/dateUtils';

@Injectable()
export class UsageRecordsEffects {
  @Effect()
  loadFilterUsageRecordsByDate$: Observable<Action> = this.actions$.pipe(
    ofType(usage.USAGE_FILTER_UPDATE),
    filter((action: usage.UsageFilterUpdate) => action.payload.date),
    map((action: usage.UsageFilterUpdate) => action.payload.date),
    map(
      date =>
        new usage.LoadUsageRecordsRequest({
          startDate: formatIso(date.fromDate),
          endDate: formatIso(date.toDate),
        }),
    ),
  );

  @Effect()
  loadUsageRecords$: Observable<Action> = this.actions$.pipe(
    ofType(usage.LOAD_USAGES_REQUEST),
    switchMap((action: usage.LoadUsageRecordsRequest) => {
      return this.usageService.getListAll(action.payload).pipe(
        map((usageRecords: UsageRecord[]) => {
          return new usage.LoadUsageRecordsResponse(usageRecords);
        }),
        catchError(() => of(new usage.LoadUsageRecordsResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private usageService: UsageService) {}
}
