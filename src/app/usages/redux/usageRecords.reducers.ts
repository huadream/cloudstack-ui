import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as moment from 'moment';
import * as usageActions from './usageRecords.actions';
import { Usage } from '../usage.model';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Usage> {
  loading: boolean;
  usageTypes: string[];
  filters: {
    date: Date;
    selectedTypes: string[];
    selectedLevels: string[];
    selectedAccountIds: string[];
    query: string;
  };
}

export interface UsageRecordsState {
  list: State;
}

export const reducers = {
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
export const adapter: EntityAdapter<Usage> = createEntityAdapter<Usage>({
  selectId: (item: Usage) => item.usageid,
  sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  usageTypes: [],
  filters: {
    date: moment().toDate(),
    selectedTypes: [],
    selectedLevels: [],
    selectedAccountIds: [],
    query: '',
  },
});

export function reducer(state = initialState, action: usageActions.Actions): State {
  switch (action.type) {
    case usageActions.LOAD_USAGES_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case usageActions.USAGE_FILTER_UPDATE: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case usageActions.LOAD_USAGES_RESPONSE: {
      const usageRecords = action.payload;
      const types = Object.keys(
        usageRecords.reduce((memo, usage) => {
          return { ...memo, [usage.usagetype]: usage.usagetype };
        }, {}),
      );

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(usageRecords, state),
        usageTypes: types,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export const getUsageRecordsState = createFeatureSelector<UsageRecordsState>('usageRecords');

export const getUsageRecordsEntitiesState = createSelector(
  getUsageRecordsState,
  state => state.list,
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors(
  getUsageRecordsEntitiesState,
);

export const isLoading = createSelector(
  getUsageRecordsEntitiesState,
  state => state.loading,
);

export const usageTypes = createSelector(
  getUsageRecordsEntitiesState,
  state => state.usageTypes,
);

export const filters = createSelector(
  getUsageRecordsEntitiesState,
  state => state.filters,
);

export const filterDate = createSelector(
  filters,
  state => state.date,
);

export const filterQuery = createSelector(
  filters,
  state => state.query,
);

export const filterSelectedTypes = createSelector(
  filters,
  state => state.selectedTypes,
);

export const filterSelectedLevels = createSelector(
  filters,
  state => state.selectedLevels,
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds,
);

export const selectFilteredUsageRecords = createSelector(
  selectAll,
  filterQuery,
  filterSelectedTypes,
  filterSelectedLevels,
  filterSelectedAccountIds,
  fromAccounts.selectEntities,
  (usageRecords, query, selectedTypes, selectedLevels, selectedAccountIds, accountEntities) => {
    const queryLower = query && query.toLowerCase();
    const typeMap = selectedTypes.reduce((m, i) => ({ ...m, [i]: i }), {});
    const levelsMap = selectedLevels.reduce((m, i) => ({ ...m, [i]: i }), {});

    const queryFilter = usage =>
      !query ||
      usage.description.toLowerCase().includes(queryLower) ||
      usage.level.toLowerCase().includes(queryLower) ||
      usage.type.toLowerCase().includes(queryLower) ||
      usage.time.toLowerCase().includes(queryLower);

    const selectedTypesFilter = usage => !selectedTypes.length || !!typeMap[usage.type];

    const selectedLevelsFilter = usage => {
      return !selectedLevels.length || !!levelsMap[usage.level];
    };

    const accountsMap = selectedAccountIds.reduce((memo, id) => {
      const account = accountEntities[id];
      if (account) {
        return { ...memo, [`${account.name}_${account.domain}`]: account };
      }
      return memo;
    }, {});

    const selectedAccountIdsFilter = usage =>
      !selectedAccountIds.length || accountsMap[`${usage.account}_${usage.domain}`];

    return usageRecords.filter(usage => {
      return (
        queryFilter(usage) &&
        selectedTypesFilter(usage) &&
        selectedLevelsFilter(usage) &&
        selectedAccountIdsFilter(usage)
      );
    });
  },
);
