import {
  ChangeDetectionStrategy,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';

import { State, UserTagsActions } from '../../root-store';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as fromSsh_keys from '../../reducers/ssh-keys/redux/ssh-key.reducers';
import * as fromTemplates from '../../reducers/templates/redux/template.reducers';
import * as fromQuota from '../../quota/redux/quota-summary/quota-summary.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as ssh_keyActions from '../../reducers/ssh-keys/redux/ssh-key.actions';
import * as templateActions from '../../reducers/templates/redux/template.actions';
import * as quotaActions from '../../quota/redux/quota-summary/quota-summary.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';

@Component({
  selector: 'cs-dashboard',
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.scss'],
})
export class DashboardContainerComponent extends WithUnsubscribe() implements OnInit {
  public username: string;
  readonly vms$ = this.store.pipe(select(fromVMs.selectAll));
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectAll));
  readonly keys$ = this.store.pipe(select(fromSsh_keys.selectAll));
  readonly templates$ = this.store.pipe(select(fromTemplates.selectAll));
  readonly quotaSummary$ = this.store.pipe(select(fromQuota.selectAll));
  readonly account$ = this.store.pipe(select(fromAccounts.selectUserAccount));

  constructor(private store: Store<State>) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(new vmActions.LoadVMsRequest());
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
    this.store.dispatch(new ssh_keyActions.LoadSshKeyRequest());
    this.store.dispatch(new quotaActions.LoadQuotaSummaryRequest());
  }
}
