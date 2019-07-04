import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepicker, MatDialog } from '@angular/material';
import { onErrorResumeNext } from 'rxjs/operators';
import DateTimeFormat = Intl.DateTimeFormat;
import { Language } from '../../types';
import { DatePickerDialogComponent } from '../date-picker';
import { formatIso } from '../date-picker/dateUtils';
import moment = require('moment');
import { DatePeriod } from '../../interfaces';

interface DatePickerConfig {
  okLabel?: string;
  cancelLabel?: string;
  date?: Date;
  dateTimeFormat?: Function;
  firstDayOfWeek?: number;
  locale?: string;
}

@Component({
  selector: 'cs-period-picker',
  templateUrl: 'period-picker.component.html',
  styleUrls: ['period-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PeriodPickerComponent),
      multi: true,
    },
  ],
})
export class PeriodPickerComponent implements ControlValueAccessor, OnChanges {
  @Input()
  public label = '';
  @Input()
  public okLabel = 'Ok';
  @Input()
  public cancelLabel = 'Cancel';
  @Input()
  public firstDayOfWeek = 1;
  @Input()
  public dateTimeFormat = DateTimeFormat;
  @Input()
  public locale = Language.en;
  @Input()
  public disabled = false;
  @Input()
  public maxDate = new Date();
  @Output()
  public changed = new EventEmitter();

  @ViewChild('fromDatePicker')
  private fromDatePicker;
  @ViewChild('toDatePicker')
  private toDatePicker;

  private preDisabled = false;
  private nextDisabled = true;

  // tslint:disable-next-line:variable-name
  private _fromDate = new FormControl(new Date());
  // tslint:disable-next-line:variable-name
  private _toDate = new FormControl(new Date());

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    const dateTimeFormatChange = changes['dateTimeFormat'];
    if (dateTimeFormatChange) {
    }
  }

  public propagateChange: any = () => {};

  public writeValue(value: DatePeriod): void {
    if (value) {
      this._toDate.setValue(value.toDate > this.maxDate ? new Date(this.maxDate) : value.toDate, {
        emitEvent: true,
        emitModelToViewChange: true,
      });

      this._fromDate.setValue(
        value.fromDate > this.maxDate ? new Date(this.maxDate) : value.fromDate,
        {
          emitEvent: true,
          emitModelToViewChange: true,
        },
      );
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public dateChange() {
    this.nextDisabled =
      this.maxDate.setHours(0, 0, 0, 0) <= this._toDate.value.setHours(0, 0, 0, 0);

    this.changed.emit({ fromDate: this._fromDate.value, toDate: this._toDate.value });
    this.propagateChange({ fromDate: this._fromDate.value, toDate: this._toDate.value });
  }

  public adjustDate(pre: boolean) {
    let period =
      this._toDate.value.setHours(0, 0, 0, 0) - this._fromDate.value.setHours(0, 0, 0, 0);

    period += 86400 * 1000;
    if (pre) {
      period = -period;
    }

    this.writeValue({
      fromDate: new Date(this._fromDate.value.valueOf() + period),
      toDate: new Date(this._toDate.value.valueOf() + period),
    });
    this.dateChange();
  }

  public nextClicked() {
    this.adjustDate(false);
  }

  public preClicked() {
    this.adjustDate(true);
  }

  private formatDate(date: Date): string {
    if (this.locale) {
      return new this.dateTimeFormat(this.locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(date);
    }
    return formatIso(date);
  }
}
