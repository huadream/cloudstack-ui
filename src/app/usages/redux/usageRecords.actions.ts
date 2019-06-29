import { Action } from '@ngrx/store';
import { Usage } from '../usage.model';

export const LOAD_USAGES_REQUEST = '[UsageRecords] LOAD_USAGES_REQUEST';
export const LOAD_USAGES_RESPONSE = '[UsageRecords] LOAD_USAGES_RESPONSE';
export const USAGE_FILTER_UPDATE = '[UsageRecords] USAGE_FILTER_UPDATE';

export class LoadUsageRecordsRequest implements Action {
  type = LOAD_USAGES_REQUEST;

  constructor(public payload: any) {}
}

export class LoadUsageRecordsResponse implements Action {
  type = LOAD_USAGES_RESPONSE;

  constructor(public payload: Usage[]) {}
}

export class UsageFilterUpdate implements Action {
  type = USAGE_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {}
}

export type Actions = LoadUsageRecordsResponse | LoadUsageRecordsRequest | UsageFilterUpdate;
