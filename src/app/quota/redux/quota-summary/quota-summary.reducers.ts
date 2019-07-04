import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as quotaActions from './quota-summary.actions';
import { QuotaSummary } from '../../model/quota-summary.model';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import { getAccountsEntitiesState } from '../../../reducers/accounts/redux/accounts.reducers';
import * as quotaStatementActions from '../quota-statement/quota-statement.actions';
import * as accountActions from '../../../reducers/accounts/redux/accounts.actions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<QuotaSummary> {
  loading: boolean;
  selectedAccountId: number;
  filters: {
    query: string;
    selectedAccountIds: string[];
  };
}

export interface QuotaSummaryState {
  list: State;
}

export const quotaSummaryReducers = {
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
export const adapter: EntityAdapter<QuotaSummary> = createEntityAdapter<QuotaSummary>({
  selectId: (item: QuotaSummary) => item.accountid,
  sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  selectedAccountId: null,
  filters: {
    selectedAccountIds: [],
    query: '',
  },
});

export function reducer(state = initialState, action: quotaActions.Actions): State {
  switch (action.type) {
    case quotaActions.LOAD_QUOTA_SUMMARY_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case quotaActions.LOAD_SELECTED_SUMMARY_REQUEST: {
      return {
        ...state,
        selectedAccountId: action.payload,
      };
    }

    case quotaActions.QUOTA_SUMMARY_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case quotaActions.LOAD_QUOTA_SUMMARY_RESPONSE: {
      const quotaSummaries = action.payload;

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(quotaSummaries, state),
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getQuotaSummaryState = createFeatureSelector<QuotaSummaryState>('quotaSummary');

export const getQuotaSummaryRecordsEntitiesState = createSelector(
  getQuotaSummaryState,
  state => state.list,
);

export const getSelectedId = createSelector(
  getAccountsEntitiesState,
  state => state.selectedAccountId,
);

export const getSelectedQuotaSummary = createSelector(
  getQuotaSummaryState,
  getSelectedId,
  (state, selectedId) => state.list.entities[selectedId],
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getQuotaSummaryRecordsEntitiesState,
);

export const isLoading = createSelector(
  getQuotaSummaryRecordsEntitiesState,
  state => state.loading,
);

export const filters = createSelector(
  getQuotaSummaryRecordsEntitiesState,
  state => state.filters,
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds,
);

export const filterQuery = createSelector(
  filters,
  state => state.query,
);

export const selectFilteredQuotaSummary = createSelector(
  selectAll,
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

export const selectQueryQuotaSummary = createSelector(
  selectAll,
  filterQuery,
  (quotaSummaries, query) => {
    const queryLower = query && query.toLowerCase();
    const queryFilter = quotaSummary =>
      !query || quotaSummary.name.toLowerCase().includes(queryLower);

    return quotaSummaries.filter(account => {
      return queryFilter(account);
    });
  },
);
