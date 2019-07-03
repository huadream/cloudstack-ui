import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { PeriodicElement } from '../containers/quota-statement.container';
import { QuotaStatement } from '../model/quota-statement.model';
import { MatTableDataSource } from '@angular/material';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../shared/types';
import { DatePeriod } from '../../shared/interfaces';
import { usageTypeClass, usageTypeClassName } from '../../usages/usage-record.model';

@Component({
  selector: 'cs-quota-statement-list',
  templateUrl: 'quota-statement-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['quota-statement-list.component.scss'],
})
export class QuotaStatementListComponent implements OnChanges {
  @Input()
  public quotaStatement: QuotaStatement[] = [];
  @Input()
  public firstDayOfWeek: number;
  @Input()
  public isLoading = false;
  @Output()
  public dateChange = new EventEmitter<Date>();

  public typeClassName = usageTypeClassName;
  date: DatePeriod;
  displayedColumns: string[] = ['typename', 'quota'];
  dataSource = new MatTableDataSource(usageTypeClassName);

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService,
  ) {}

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.quotaStatement.length > 0) {
      const data = [];
      usageTypeClassName.map((value, index) => {
        if (index === 0) {
          return;
        }
        data[index - 1] = {};
        data[index - 1].dataSource = [];
        data[index - 1].quota = 0;
        data[index - 1].className = value;

        this.quotaStatement[0].quotausage.map(statement => {
          if (usageTypeClass[index].includes(statement.type)) {
            data[index - 1].dataSource.push({
              quota: `${this.quotaStatement[0].currency} ${statement.quota}`,
              typename: `USAGE_TYPE.${statement.name}`,
              unit: statement.unit,
            });
            data[index - 1].quota += statement.quota;
          }
        });
      });

      // const data = [];
      // this.quotaStatement[0].quotausage.map(value => {
      //   data.push({
      //     quota: `${this.quotaStatement[0].currency} ${value.quota}`,
      //     typename: `USAGE_TYPE.${value.name}`,
      //     unit: value.unit
      //   })
      // });
      this.dataSource.data = data;
    }
  }
}
