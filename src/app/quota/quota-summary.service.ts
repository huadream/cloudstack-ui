import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';
import { BaseBackendService, FormattedResponse } from '../shared/services/base-backend.service';

import { HttpClient } from '@angular/common/http';
import { QuotaSummary } from './model/quota-summary.model';

@Injectable()
@BackendResource({
  entity: 'summary',
})
export class QuotaSummaryService extends BaseBackendService<QuotaSummary> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
