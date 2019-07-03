import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as quotaStatementActions from './quota-statement.actions';
import { QuotaStatement } from '../../model/quota-statement.model';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import { QuotaSummary } from '../../model/quota-summary.model';
import { getQuotaSummaryRecordsEntitiesState } from '../quota-summary.reducers';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<QuotaStatement> {
  loading: boolean;
  filters: {
    selectedAccountIds: string[];
  };
}

export interface QuotaStatementState {
  list: State;
}

export const quotaStatementReducers = {
  list: reducer,
};

/**
 * createEntityAdapter creates many an object of helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<QuotaStatement> = createEntityAdapter<QuotaStatement>({
  selectId: (item: QuotaStatement) => `${item.query.domainid}_${item.query.account}`,
  sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    selectedAccountIds: [],
    query: '',
  },
});

export function reducer(state = initialState, action: quotaStatementActions.Actions): State {
  switch (action.type) {
    case quotaStatementActions.LOAD_QUOTA_STATEMENT_REQUEST: {
      return {
        ...adapter.removeAll(state),
        loading: true,
      };
    }
    case quotaStatementActions.LOAD_QUOTA_STATEMENT_RESPONSE: {
      const quotaStatement = action.payload;
      if (quotaStatement === null) {
        return { ...state, loading: false };
      }
      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll([quotaStatement], state),
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getQuotaStatementState = createFeatureSelector<QuotaStatementState>('quotaStatement');

export const getQuotaStatementEntitiesState = createSelector(
  getQuotaStatementState,
  state => state.list,
);

export const isLoading = createSelector(
  getQuotaStatementEntitiesState,
  state => state.loading,
);

export const filters = createSelector(
  getQuotaStatementEntitiesState,
  state => state.filters,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getQuotaStatementEntitiesState,
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds,
);

export const selectFilteredQuotaStatement = createSelector(
  filterSelectedAccountIds,
  fromAccounts.selectEntities,
  (quotaSummary, selectedAccountIds, accountEntities) => {
    const accountsMap = selectedAccountIds.reduce((memo, id) => {
      const account = accountEntities[id];
      if (account) {
        return { ...memo, [`${account.name}_${account.domain}`]: account };
      }
      return memo;
    }, {});

    const selectedAccountIdsFilter = quotaSummaries =>
      !selectedAccountIds.length ||
      accountsMap[`${quotaSummaries.account}_${quotaSummaries.domain}`];

    return quotaSummary.filter(quotaSummaries => {
      return selectedAccountIdsFilter(quotaSummaries);
    });
  },
);
