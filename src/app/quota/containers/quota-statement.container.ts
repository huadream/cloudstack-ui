import { Component } from '@angular/core';

import { State } from '../../root-store';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

export interface PeriodicElement {
  detail: string;
  action: string;
}

@Component({
  selector: 'cs-quota-statement',
  templateUrl: './quota-statement.container.html',
  styleUrls: ['./quota-statement.container.scss'],
})
export class QuotaStatementContainerComponent extends WithUnsubscribe() {
  displayedColumns: string[] = ['detail', 'action'];
  ELEMENT_DATA: PeriodicElement[] = [
    {
      detail: `instances`,
      action: 'Create Instance',
    },
    {
      detail: `Templates`,
      action: 'Create Template',
    },
    {
      detail: `Volumes`,
      action: 'Create Volume',
    },
    {
      detail: `SSH keypairs`,
      action: 'Add SSH Key',
    },
  ];
  dataSource = this.ELEMENT_DATA;

  constructor(private auth: AuthService) {
    super();
  }
}
