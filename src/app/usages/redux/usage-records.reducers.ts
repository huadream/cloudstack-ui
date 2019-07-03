import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as moment from 'moment';
import * as usageActions from './usage-records.actions';
import { UsageRecord, usageTypeClass } from '../usage-record.model';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { DatePeriod } from '../../shared/interfaces';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<UsageRecord> {
  loading: boolean;
  filters: {
    date: DatePeriod;
    selectedAccountIds: string[];
    selectedClass: number;
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
export const adapter: EntityAdapter<UsageRecord> = createEntityAdapter<UsageRecord>({
  selectId: (item: UsageRecord) => item.id,
  sortComparer: false,
});

/** getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  loading: false,
  filters: {
    date: { fromDate: moment().toDate(), toDate: moment().toDate() },
    selectedAccountIds: [],
    selectedClass: 0,
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
      const usageRecordsMerge = action.payload.reduce((pre, m) => {
        if (m.usageid) {
          const id = `${m.usageid}_${m.usagetype}`;
          if (pre[id]) {
            pre[id].usagehour += Number(m.rawusage);
          } else {
            pre[id] = { id, ...m, usagehour: Number(m.rawusage) };
          }
        }
        return pre;
      }, {});
      const usageRecords = Object.keys(usageRecordsMerge).map(key => usageRecordsMerge[key]);

      // const types = Object.keys(
      //   usageRecords.reduce((memo, usage) => {
      //     return { ...memo, [usage.usagetype]: usage.usagetype };
      //   }, {}),
      // );

      return {
        /**
         * The addMany function provided by the created adapter
         * adds many records to the entity dictionary
         * and returns a new state including those records. If
         * the collection is to be sorted, the adapter will
         * sort each record upon entry into the sorted array.
         */
        ...adapter.addAll(usageRecords, state),
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

export const filterSelectedClass = createSelector(
  filters,
  state => state.selectedClass,
);

export const filterSelectedAccountIds = createSelector(
  filters,
  state => state.selectedAccountIds,
);

export const selectFilteredUsageRecords = createSelector(
  selectAll,
  filterQuery,
  filterSelectedClass,
  filterSelectedAccountIds,
  fromAccounts.selectEntities,
  (usageRecords, query, selectedClass, selectedAccountIds, accountEntities) => {
    const queryLower = query && query.toLowerCase();
    const typeMap = usageTypeClass[selectedClass].reduce((m, i) => ({ ...m, [i]: i }), {});

    const queryFilter = usage =>
      !query ||
      usage.description.toLowerCase().includes(queryLower) ||
      usage.level.toLowerCase().includes(queryLower) ||
      usage.type.toLowerCase().includes(queryLower) ||
      usage.time.toLowerCase().includes(queryLower);

    const selectedTypesFilter = usage => selectedClass === 0 || !!typeMap[usage.usagetype];

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
      return queryFilter(usage) && selectedTypesFilter(usage) && selectedAccountIdsFilter(usage);
    });
  },
);
