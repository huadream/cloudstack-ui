import { virtualMachinesSubroutes } from './virtual-machines-subroutes';
import { accountsSubroutes } from './accounts-subroutes';
import { Route } from '../models';
import { quotaSubroutes } from './quota-subroutes';

export const appNavRoutes: Route[] = [
  {
    id: 'virtual-machines',
    text: 'NAVIGATION_SIDEBAR.CLOUD',
    path: '/instances',
    icon: 'mdi-cloud',
    subroutes: virtualMachinesSubroutes,
  },
  {
    id: 'quota',
    text: 'NAVIGATION_SIDEBAR.QUOTA',
    path: '/quota',
    icon: 'mdi-circle-slice-5',
    subroutes: quotaSubroutes,
  },
  {
    id: 'accounts',
    text: 'NAVIGATION_SIDEBAR.ACCOUNTS',
    path: '/accounts',
    icon: 'mdi-account-supervisor',
    subroutes: accountsSubroutes,
  },
];
