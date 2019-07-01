import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { QuotaSummary } from '../../quota/model/quota-summary.model';
import { Account } from '../../shared/models';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'cs-dashboard-credit',
  styleUrls: ['dashboard-credit.component.scss'],
  templateUrl: 'dashboard-credit.component.html',
})
export class DashboardCreditComponent implements OnChanges {
  @Input()
  public quotaSummary: QuotaSummary[];
  @Input()
  public account: Account;
  private quota: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.account && this.quotaSummary) {
      this.quotaSummary.forEach(summary => {
        if (summary.account === this.account.name && summary.domain === this.account.domain) {
          this.quota = `${summary.currency} ${summary.balance}`;
        }
      });
    }
  }
}
