import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { QuotaStatement } from '../model/quota-statement.model';
import { MatTableDataSource } from '@angular/material';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../shared/types';
import { DatePeriod } from '../../shared/interfaces';
import { usageTypeClass, usageTypeClassName } from '../../usages/usage-record.model';
import { Account } from '../../shared/models';
import { QuotaSummary } from '../model/quota-summary.model';

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
  @Input()
  public isAdmin: false;
  @Input()
  public accounts: Account[] = [];
  @Input()
  public accountQuery: string;
  @Input()
  public selectedAccountId: number;
  @Input()
  public date: DatePeriod;
  @Output()
  public dateChange = new EventEmitter<DatePeriod>();
  @Output()
  public accountChanged = new EventEmitter<string>();
  @Output()
  public accountQueryChanged = new EventEmitter<string>();

  displayedColumns: string[] = ['typename', 'quota'];
  dataSource = new MatTableDataSource([]);

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService,
  ) {}

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public onSelectedAccountChanged(selectedAccountId: string) {
    this.accountChanged.emit(selectedAccountId);
    this.dateChange.emit(this.date);
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
        data[index - 1].className = value;
        let sum = 0;
        this.quotaStatement[0].quotausage.map(statement => {
          if (usageTypeClass[index].includes(statement.type)) {
            data[index - 1].dataSource.push({
              quota: `${this.quotaStatement[0].currency} ${statement.quota}`,
              typename: `USAGE_TYPE.${statement.name}`,
              unit: statement.unit,
            });
            sum += statement.quota;
          }
        });

        data[index - 1].quota = `${this.quotaStatement[0].currency} ${sum.toFixed(2)}`;
      });

      this.dataSource.data = data;
    }
  }
}
