import { BaseModel } from '../shared/models/base.model';

export interface Usage extends BaseModel {
  description: string;
  account: string;
  domainid: string;
  domain: string;
  usageid: string;
  usagetype: string;
  rawusage: string;
  zoneid: string;
}
