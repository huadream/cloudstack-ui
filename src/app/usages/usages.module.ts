import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { UsageService } from './usage.service';
import { UsageListContainerComponent } from './containers/usage-list.container';
import { reducers } from './redux/usageRecords.reducers';
import { UsageRecordsEffects } from './redux/usageRecords.effects';
import { UsageListComponent } from './components/usage-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    StoreModule.forFeature('usageRecords', reducers),
    EffectsModule.forFeature([UsageRecordsEffects]),
  ],
  declarations: [UsageListContainerComponent, UsageListComponent],
  providers: [UsageService],
})
export class UsagesModule {}
