import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { QuotaUsageContainerComponent } from './containers/quota-usage.container';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule],
  declarations: [QuotaUsageContainerComponent],
})
export class QuotaModule {}
