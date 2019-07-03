import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as quotaActions from './quota-summary.actions';
import { QuotaSummary } from '../model/quota-summary.model';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<QuotaSummary> {
  loading: boolean;
  filters: {
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
