import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import * as quotaAction from './quota-summary.actions';

import { QuotaSummary } from '../model/quota-summary.model';
import { QuotaSummaryService } from '../quota-summary.service';

const customApiFormat = { command: 'quota', entity: 'Summary' };
@Injectable()
export class QuotaSummaryEffects {
  @Effect()
  loadUsageRecords$: Observable<Action> = this.actions$.pipe(
    ofType(quotaAction.LOAD_QUOTA_SUMMARY_REQUEST),
    switchMap((action: quotaAction.LoadQuotaSummaryRequest) => {
      return this.quotaSummaryService.getListAll(action.payload, customApiFormat).pipe(
        map((quotaSummaries: QuotaSummary[]) => {
          return new quotaAction.LoadQuotaSummaryResponse(quotaSummaries);
        }),
        catchError(() => of(new quotaAction.LoadQuotaSummaryResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private quotaSummaryService: QuotaSummaryService) {}
}
