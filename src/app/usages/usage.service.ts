import { Injectable } from '@angular/core';
import { BackendResource } from '../shared/decorators';
import { BaseBackendService, FormattedResponse } from '../shared/services/base-backend.service';

import { Usage, usageTypeNameMap } from './usage.model';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { DateTimeFormatterService } from '../shared/services/date-time-formatter.service';

@Injectable()
@BackendResource({
  entity: 'UsageRecord',
})
export class UsageService extends BaseBackendService<Usage> {
  constructor(
    protected http: HttpClient,
    private dateTimeFormatterService: DateTimeFormatterService,
  ) {
    super(http);
  }

  protected formatGetListResponse(response: any): FormattedResponse<Usage> {
    const result = super.formatGetListResponse(response);

    return {
      list: result.list.map(m => this.prepareUsageModel(m)),
      meta: result.meta,
    };
  }

  private prepareUsageModel(usageRecord): Usage {
    usageRecord.usageTypeName = usageTypeNameMap[usageRecord.usagetype];
    return usageRecord;
  }
}
