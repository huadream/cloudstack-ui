import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import * as quotaStatementAction from './quota-statement.actions';

import { QuotaStatement } from '../../model/quota-statement.model';
import { QuotaStatementService } from '../../quota-statement.service';

@Injectable()
export class QuotaStatementEffects {
  @Effect()
  loadUsageRecords$: Observable<Action> = this.actions$.pipe(
    ofType(quotaStatementAction.LOAD_QUOTA_STATEMENT_REQUEST),
    switchMap((action: quotaStatementAction.LoadQuotaStatementRequest) => {
      return this.quotaStatementService.getStatement(action.payload).pipe(
        map((quotaStatement: QuotaStatement) => {
          if (quotaStatement) {
            quotaStatement.query = action.payload;
          }
          return new quotaStatementAction.LoadQuotaStatementResponse(quotaStatement);
        }),
        catchError(() => of(new quotaStatementAction.LoadQuotaStatementResponse(null))),
      );
    }),
  );

  constructor(private actions$: Actions, private quotaStatementService: QuotaStatementService) {}
}
