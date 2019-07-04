import { Subroute } from '../models';

export const billingSubroutes: Subroute[] = [
  {
    text: 'NAVIGATION_SIDEBAR.QUOTA-STATEMENT',
    path: '/quota-statement',
    icon: 'mdi-calendar-text',
    routeId: 'billing',
  },
  {
    text: 'NAVIGATION_SIDEBAR.USAGE',
    path: '/usages',
    icon: 'mdi-chart-bar',
    routeId: 'billing',
  },
];
