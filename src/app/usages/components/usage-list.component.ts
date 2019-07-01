import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatTabChangeEvent, MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { Usage } from '../usage.model';
import { DateTimeFormatterService } from '../../shared/services/date-time-formatter.service';
import { Account } from '../../shared/models/account.model';
import { Language } from '../../shared/types';

const typeMerge = [
  [],
  ['1', '2', '15', '16', '17', '25'],
  ['6', '9', '21', '22', '23', '24'],
  ['3', '4', '5', '13'],
  ['7', '8'],
  ['10', '11', '12', '14'],
];

@Component({
  selector: 'cs-usage-list',
  templateUrl: 'usage-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['usage-list.component.scss'],
})
export class UsageListComponent implements OnChanges {
  @Input()
  public usages: Usage[] = [];
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
  @Output()
  public queryChanged = new EventEmitter<string>();
  @Output()
  public usageTypesChanged = new EventEmitter<string[]>();
  @Output()
  public selectedLevelsChanged = new EventEmitter<string[]>();
  @Output()
  public accountChanged = new EventEmitter<string[]>();

  public dataSource: MatTableDataSource<Usage>;
  public tableColumns = ['account', 'usagetype', 'usagehour', 'description'];
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

  public onTabChanged(index: number) {
    this.selectedTypes = typeMerge[index] ? typeMerge[index] : [];
    this.usageTypesChanged.emit(this.selectedTypes);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const usages = changes['usages'];
    if (usages) {
      this.dataSource.data = usages.currentValue;
    }
  }
}
