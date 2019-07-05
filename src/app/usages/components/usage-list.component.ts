import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { UsageRecord, usageTypeClass, usageTypeClassName } from '../usage-record.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { Account } from '../../shared/models/account.model';
import { Language } from '../../shared/types';
import { DatePeriod } from '../../shared/interfaces';

@Component({
  selector: 'cs-usage-list',
  templateUrl: 'usage-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['usage-list.component.scss'],
})
export class UsageListComponent implements OnChanges {
  @Input()
  public usages: UsageRecord[] = [];
  @Input()
  public firstDayOfWeek: number;
  @Input()
  public isLoading = false;
  @Input()
  public date: DatePeriod;
  @Input()
  public query: string;
  @Input()
  public accounts: Account[] = [];
  @Input()
  public selectedAccountIds: string[] = [];
  @Input()
  public isAdmin: boolean;
  @Input()
  public selectedClass: number;
  @Output()
  public dateChange = new EventEmitter<Date>();
  @Output()
  public queryChanged = new EventEmitter<string>();
  @Output()
  public selectedClassChange = new EventEmitter<number>();
  @Output()
  public accountChanged = new EventEmitter<string[]>();

  public accountsFiltered: Account[] = [];
  public accountQuery = '';
  public tabs = usageTypeClassName;
  public dataSource: MatTableDataSource<UsageRecord>;
  public tableColumns = ['usagetype', 'usagehour', 'description'];
  public tableColumnsAdmin = ['account', 'usagetype', 'usagehour', 'description'];
  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService,
  ) {
    this.dataSource = new MatTableDataSource<UsageRecord>([]);
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public onTabChanged(index: number) {
    this.selectedClass = index;
    this.selectedClassChange.emit(this.selectedClass);
    // this.usageTypesChanged.emit(this.selectedTypes);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const usages = changes['usages'];
    const accounts = changes['accounts'];
    if (usages) {
      this.dataSource.data = usages.currentValue;
    }
    if (accounts) {
      this.onAccountQueryChanged(this.accountQuery);
    }
  }

  public rawUsageToString(raw: number): string {
    let hour = Math.floor(raw);
    const day = Math.floor(hour / 24);
    let temp = (raw - hour) * 60;
    hour = hour % 24;
    const minute = Math.floor(temp);
    temp = (temp - minute) * 60;
    const second = Math.floor(temp);
    let output = '';
    if (day > 0) {
      output = `${day} days`;
    }
    if (hour > 0) {
      output = `${output} ${hour} hrs`;
    }
    if (minute > 0) {
      output = `${output} ${minute} min`;
    }
    if (second > 0) {
      output = `${output} ${second} sec`;
    }
    return output;
  }

  public onAccountQueryChanged(accountQuery: string) {
    const queryLower = accountQuery && accountQuery.toLowerCase();
    this.accountsFiltered = this.accounts.filter(
      account => !accountQuery || account.name.toLowerCase().includes(queryLower),
    );
  }
}
