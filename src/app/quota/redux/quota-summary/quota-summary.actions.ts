import { Action } from '@ngrx/store';
import { QuotaSummary } from '../../model/quota-summary.model';
import { LOAD_SELECTED_ACCOUNT } from '../../../reducers/accounts/redux/accounts.actions';

export const LOAD_QUOTA_SUMMARY_REQUEST = '[QuotaSummary] LOAD_QUOTA_SUMMARY_REQUEST';
export const LOAD_QUOTA_SUMMARY_RESPONSE = '[QuotaSummary] LOAD_QUOTA_SUMMARY_RESPONSE';
export const QUOTA_SUMMARY_FILTER_UPDATE = '[QuotaSummary] QUOTA_SUMMARY_FILTER_UPDATE';
export const LOAD_SELECTED_SUMMARY_REQUEST = '[QuotaSummary] LOAD_SELECTED_SUMMARY_REQUEST';

export class LoadQuotaSummaryRequest implements Action {
  type = LOAD_QUOTA_SUMMARY_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadQuotaSummaryResponse implements Action {
  type = LOAD_QUOTA_SUMMARY_RESPONSE;

  constructor(public payload: QuotaSummary[]) {}
}

export class QuotaSummaryFilterUpdate implements Action {
  type = QUOTA_SUMMARY_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {}
}

export class LoadSelectedQuotaSummary implements Action {
  type = LOAD_SELECTED_SUMMARY_REQUEST;

  constructor(public payload: number) {}
}

export type Actions = LoadQuotaSummaryResponse | LoadQuotaSummaryRequest | QuotaSummaryFilterUpdate;
