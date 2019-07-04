import { Action } from '@ngrx/store';
import { QuotaStatement, QuotaStatementQuery } from '../../model/quota-statement.model';
import { USAGE_FILTER_UPDATE } from '../../../usages/redux/usage-records.actions';

export const LOAD_QUOTA_STATEMENT_REQUEST = '[QuotaSummary] LOAD_QUOTA_STATEMENT_REQUEST';
export const LOAD_QUOTA_STATEMENT_RESPONSE = '[QuotaSummary] LOAD_QUOTA_STATEMENT_RESPONSE';

export class LoadQuotaStatementRequest implements Action {
  type = LOAD_QUOTA_STATEMENT_REQUEST;

  constructor(public payload?: QuotaStatementQuery | any) {}
}

export class LoadQuotaStatementResponse implements Action {
  type = LOAD_QUOTA_STATEMENT_RESPONSE;

  constructor(public payload: QuotaStatement) {}
}

export type Actions = LoadQuotaStatementResponse | LoadQuotaStatementRequest;
