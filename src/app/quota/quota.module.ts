import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { QuotaStatementContainerComponent } from './containers/quota-statement.container';
import { QuotaSummaryService } from './quota-summary.service';

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule],
  declarations: [QuotaStatementContainerComponent],
  providers: [QuotaSummaryService],
})
export class QuotaModule {}
