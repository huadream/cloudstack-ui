import { Action } from '@ngrx/store';
import { QuotaSummary } from '../model/quota-summary.model';

export const LOAD_QUOTA_SUMMARY_REQUEST = '[QuotaSummary] LOAD_QUOTA_SUMMARY_REQUEST';
export const LOAD_QUOTA_SUMMARY_RESPONSE = '[QuotaSummary] LOAD_QUOTA_SUMMARY_RESPONSE';

export class LoadQuotaSummaryRequest implements Action {
  type = LOAD_QUOTA_SUMMARY_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadQuotaSummaryResponse implements Action {
  type = LOAD_QUOTA_SUMMARY_RESPONSE;

  constructor(public payload: QuotaSummary[]) {}
}

export type Actions = LoadQuotaSummaryResponse | LoadQuotaSummaryRequest;
