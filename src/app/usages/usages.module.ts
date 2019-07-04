import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { UsageService } from './usage.service';
import { UsageRecordsContainerComponent } from './containers/usage-records.container';
import { reducers } from './redux/usage-records.reducers';
import { UsageRecordsEffects } from './redux/usage-records.effects';
import { UsageListComponent } from './components/usage-list.component';
import { QuotaModule } from '../quota/quota.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    QuotaModule,
    NgxMatSelectSearchModule,
    StoreModule.forFeature('usageRecords', reducers),
    EffectsModule.forFeature([UsageRecordsEffects]),
  ],
  declarations: [UsageRecordsContainerComponent, UsageListComponent],
  providers: [UsageService],
})
export class UsagesModule {}
