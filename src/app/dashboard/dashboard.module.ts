import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { DashboardContainerComponent } from './containers/dashboard.container';
import { DashboardSummaryComponent } from './components/dashboard-summary.component';
import { DashboardCreditComponent } from './components/dashboard-credit.component';
import { RouterModule } from '@angular/router';
import { virtualMachineReducers } from '../reducers/vm/redux/vm.reducers';
import { accountReducers } from '../reducers/accounts/redux/accounts.reducers';
import { accountTagsReducers } from '../reducers/account-tags/redux/account-tags.reducers';
import { zoneReducers } from '../reducers/zones/redux/zones.reducers';
import { serviceOfferingReducers } from '../reducers/service-offerings/redux/service-offerings.reducers';
import { VirtualMachinesEffects } from '../reducers/vm/redux/vm.effects';
import { VirtualMachineCreationEffects } from '../reducers/vm/redux/vm-creation.effects';
import { ZonesEffects } from '../reducers/zones/redux/zones.effects';
import { AccountsEffects } from '../reducers/accounts/redux/accounts.effects';
import { AccountTagsEffects } from '../reducers/account-tags/redux/account-tags.effects';
import { ServiceOfferingEffects } from '../reducers/service-offerings/redux/service-offerings.effects';
import { quotaSummaryReducers } from '../quota/redux/quota.reducers';
import { QuotaEffects } from '../quota/redux/quota.effects';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MaterialModule,
    StoreModule.forFeature('virtualMachines', virtualMachineReducers),
    StoreModule.forFeature('accounts', accountReducers),
    StoreModule.forFeature('tags', accountTagsReducers),
    StoreModule.forFeature('zones', zoneReducers),
    StoreModule.forFeature('service-offerings', serviceOfferingReducers),
    StoreModule.forFeature('quota-summary', quotaSummaryReducers),
    EffectsModule.forFeature([
      VirtualMachinesEffects,
      VirtualMachineCreationEffects,
      ZonesEffects,
      AccountsEffects,
      AccountTagsEffects,
      ServiceOfferingEffects,
      QuotaEffects,
    ]),
  ],
  declarations: [DashboardContainerComponent, DashboardSummaryComponent, DashboardCreditComponent],
})
export class DashboardModule {}
