import { BaseModel } from '../../shared/models/base.model';

export interface QuotaSummary extends BaseModel {
  account: string;
  accountid: number;
  balance: number;
  currency: string;
  domain: string;
  domainid: number;
  quota: number;
  state: string;
}
