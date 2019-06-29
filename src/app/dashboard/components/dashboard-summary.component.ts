import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import { State } from '../../reducers';
import { VirtualMachine } from '../../vm';
import { SSHKeyPair, Volume } from '../../shared/models';
import { Template } from '../../template/shared';

export interface PeriodicElement {
  detail: string;
  action: string;
  detail_route: string;
  action_route: string;
}

@Component({
  selector: 'cs-dashboard-summary',
  styleUrls: ['dashboard-summary.component.scss'],
  templateUrl: 'dashboard-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSummaryComponent implements OnInit, OnChanges {
  @Input()
  public vms: VirtualMachine[];
  @Input()
  public volumes: Volume[];
  @Input()
  public templates: Template[];
  @Input()
  public keys: SSHKeyPair[];

  count = 1;
  displayedColumns: string[] = ['detail', 'action'];
  dataSource = null;
  ELEMENT_DATA: PeriodicElement[];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.ELEMENT_DATA = [
      {
        detail: `${this.vms ? this.vms.length : '...'} instances`,
        action: 'Create Instance',
        detail_route: '/instances',
        action_route: '/instances/create',
      },
      {
        detail: `${this.templates ? this.templates.length : '...'} Templates`,
        action: 'Create Template',
        detail_route: '/templates',
        action_route: '/templates/create',
      },
      {
        detail: `${this.volumes ? this.volumes.length : '...'} Volumes`,
        action: 'Create Volume',
        detail_route: '/storage',
        action_route: '/storage/create',
      },
      {
        detail: `${this.keys ? this.keys.length : '...'} SSH keypairs`,
        action: 'Add SSH Key',
        detail_route: '/ssh-keys',
        action_route: '/ssh-keys/create',
      },
    ];

    this.dataSource = this.ELEMENT_DATA;
  }
}
