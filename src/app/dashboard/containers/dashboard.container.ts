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
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as ssh_keyActions from '../../reducers/ssh-keys/redux/ssh-key.actions';
import * as templateActions from '../../reducers/templates/redux/template.actions';
@Component({
  selector: 'cs-dashboard',
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.scss'],
})
export class DashboardContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  public username: string;
  readonly vms$ = this.store.pipe(select(fromVMs.selectAll));
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectAll));
  readonly keys$ = this.store.pipe(select(fromSsh_keys.selectAll));
  readonly templates$ = this.store.pipe(select(fromTemplates.selectAll));

  constructor(
    private auth: AuthService,
    private store: Store<State>,
    private cd: ChangeDetectorRef,
  ) {
    super();
    this.username = this.auth.user ? this.auth.user.username : '';
  }

  public ngOnInit(): void {
    // this.store.dispatch(new UserTagsActions.LoadUserTags());
    this.store.dispatch(new vmActions.LoadVMsRequest());
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
    this.store.dispatch(new templateActions.LoadTemplatesRequest());
    this.store.dispatch(new ssh_keyActions.LoadSshKeyRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
