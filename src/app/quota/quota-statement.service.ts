import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';
import {
  BaseBackendService,
  CSCommands,
  FormattedResponse,
} from '../shared/services/base-backend.service';

import { HttpClient } from '@angular/common/http';
import { QuotaSummary } from './model/quota-summary.model';
import { Observable } from 'rxjs';
import { ApiKeys } from '../shared/models/account-user.model';
import { map } from 'rxjs/operators';
import { QuotaStatement } from './model/quota-statement.model';

@Injectable()
@BackendResource({
  entity: 'Statement',
})
export class QuotaStatementService extends BaseBackendService<QuotaStatement> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getStatement(params: QuotaStatement['query']): Observable<QuotaStatement> {
    return this.sendCommand(CSCommands.Quota, params).pipe(map(res => res.statement));
  }
}
