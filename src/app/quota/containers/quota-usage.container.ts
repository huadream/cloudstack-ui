import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { State, UserTagsActions } from '../../root-store';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

@Component({
  selector: 'cs-quota-usage',
  templateUrl: './quota-usage.container.html',
  styleUrls: ['./quota-usage.container.scss'],
})
export class QuotaUsageContainerComponent extends WithUnsubscribe() implements OnInit {
  public username: string;

  constructor(private auth: AuthService, private store: Store<State>) {
    super();
    this.username = this.auth.user ? this.auth.user.username : '';
  }

  public ngOnInit(): void {
    this.store.dispatch(new UserTagsActions.LoadUserTags());
  }
}
