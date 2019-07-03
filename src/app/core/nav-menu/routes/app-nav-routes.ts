import { virtualMachinesSubroutes } from './virtual-machines-subroutes';
import { accountsSubroutes } from './accounts-subroutes';
import { Route } from '../models';
import { billingSubroutes } from './billing-subroutes';

export const appNavRoutes: Route[] = [
  {
    id: 'virtual-machines',
    text: 'NAVIGATION_SIDEBAR.CLOUD',
    path: '/instances',
    icon: 'mdi-cloud',
    subroutes: virtualMachinesSubroutes,
  },
  {
    id: 'billing',
    text: 'NAVIGATION_SIDEBAR.BILLING',
    path: '/quota',
    icon: 'mdi-circle-slice-5',
    subroutes: billingSubroutes,
  },
  {
    id: 'accounts',
    text: 'NAVIGATION_SIDEBAR.ACCOUNTS',
    path: '/accounts',
    icon: 'mdi-account-supervisor',
    subroutes: accountsSubroutes,
  },
];
