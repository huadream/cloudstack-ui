import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { VirtualMachine } from '../../vm';
import { SSHKeyPair, Volume } from '../../shared/models';
import { Template } from '../../template/shared';

export interface SummaryList {
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

  displayedColumns: string[] = ['detail', 'action'];
  dataSource: SummaryList[] = [];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = [
      {
        detail: `${this.vms ? this.vms.length : '...'} Instances`,
        action: 'DASHBOARD_PAGE.CREATE_INSTANCE',
        detail_route: '/instances',
        action_route: '/instances/create',
      },
      {
        detail: `${this.templates ? this.templates.length : '...'} Templates`,
        action: 'DASHBOARD_PAGE.CREATE_TEMPLATE',
        detail_route: '/templates',
        action_route: '/templates/create',
      },
      {
        detail: `${this.volumes ? this.volumes.length : '...'} Volumes`,
        action: 'DASHBOARD_PAGE.CREATE_VOLUME',
        detail_route: '/storage',
        action_route: '/storage/create',
      },
      {
        detail: `${this.keys ? this.keys.length : '...'} SSH key pairs`,
        action: 'DASHBOARD_PAGE.CREATE_SSH_KEY',
        detail_route: '/ssh-keys',
        action_route: '/ssh-keys/create',
      },
    ];
  }
}
