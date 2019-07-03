import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { QuotaStatementContainerComponent } from './containers/quota-statement.container';
import { QuotaSummaryService } from './quota-summary.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { QuotaStatementEffects } from './redux/quota-statement/quota-statement.effects';
import { QuotaStatementService } from './quota-statement.service';
import { quotaStatementReducers } from './redux/quota-statement/quota-statement.reducers';
import { QuotaStatementListComponent } from './components/quota-statement-list.component';
import { PeriodPickerComponent } from './components/period-picker/period-picker.component';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StoreModule.forFeature('quotaStatement', quotaStatementReducers),
    EffectsModule.forFeature([QuotaStatementEffects]),
  ],
  exports: [PeriodPickerComponent],
  declarations: [
    QuotaStatementContainerComponent,
    QuotaStatementListComponent,
    PeriodPickerComponent,
  ],
  providers: [QuotaSummaryService, QuotaStatementService],
})
export class QuotaModule {}
