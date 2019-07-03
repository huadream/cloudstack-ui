import { BaseModel } from '../../shared/models/base.model';

export interface QuotaStatementQuery extends BaseModel {
  domainid: number;
  account: string;
  startdate: string;
  enddate: string;
}

export interface QuotaStatement extends BaseModel {
  currency: string;
  quotausage: [
    {
      quota: number;
      name: string;
      unit: string;
      accountid: number;
      domain: number;
      type: number;
    }
  ];
  totalquota: number;
  startdate: string;
  enddate: string;
  query: QuotaStatementQuery;
}
