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

import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { Account } from '../../shared/models/account.model';
import { Language } from '../../shared/types';
import { Usage } from '../../usages/usage.model';

@Component({
  selector: 'cs-quota-statement-list',
  templateUrl: 'quota-statement-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['quota-statement-list.component.scss'],
})
export class QuotaStatementListComponent implements OnChanges {
  @Input()
  public selectedTypes: string[] = [];
  @Input()
  public selectedLevels: string[] = [];
  @Input()
  public usageTypes: string[] = [];
  @Input()
  public firstDayOfWeek: number;
  @Input()
  public isLoading = false;
  @Input()
  public date: Date;
  @Input()
  public query: string;
  @Input()
  public accounts: Account[] = [];
  @Input()
  public selectedAccountIds: string[] = [];
  @Input()
  public isAdmin: boolean;
  @Output()
  public dateChange = new EventEmitter<Date>();

  public dataSource: MatTableDataSource<Usage>;
  public tableColumns = ['account', 'usagetype', 'rawusage', 'description'];
  public levels = ['INFO', 'WARN', 'ERROR'];

  constructor(
    public dateTimeFormatterService: DateTimeFormatterService,
    public translate: TranslateService,
  ) {
    this.dataSource = new MatTableDataSource<Usage>([]);
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public ngOnChanges(changes: SimpleChanges) {
    const usages = changes['usages'];
    if (usages) {
      this.dataSource.data = usages.currentValue;
    }
  }
}
