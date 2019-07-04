import { BaseModel } from '../shared/models/base.model';

export const usageTypeNameMap = [
  '',
  'USAGE_TYPE.RUNNING_VM',
  'USAGE_TYPE.ALLOCATED_VM',
  'USAGE_TYPE.IP_ADDRESS',
  'USAGE_TYPE.NETWORK_BYTES_SENT',
  'USAGE_TYPE.NETWORK_BYTES_RECEIVED',
  'USAGE_TYPE.VOLUME',
  'USAGE_TYPE.TEMPLATE',
  'USAGE_TYPE.ISO',
  'USAGE_TYPE.SNAPSHOT',
  'USAGE_TYPE.SECURITY_GROUP',
  'USAGE_TYPE.LOAD_BALANCER_POLICY',
  'USAGE_TYPE.PORT_FORWARDING_RULE',
  'USAGE_TYPE.NETWORK_OFFERING',
  'USAGE_TYPE.VPN_USERS',
  'USAGE_TYPE.CPU_CLOCK_RATE',
  'USAGE_TYPE.CPU_NUMBER',
  'USAGE_TYPE.MEMORY',
  '',
  '',
  '',
  'USAGE_TYPE.VM_DISK_IO_READ',
  'USAGE_TYPE.VM_DISK_IO_WRITE',
  'USAGE_TYPE.VM_DISK_BYTES_READ',
  'USAGE_TYPE.VM_DISK_BYTES_WRITE',
  'USAGE_TYPE.VM_SNAPSHOT',
];
export const usageTypeClassName = [
  'USAGE_TYPE_CLASS.ALL',
  'USAGE_TYPE_CLASS.INSTANCE',
  'USAGE_TYPE_CLASS.VOLUME',
  'USAGE_TYPE_CLASS.NETWORK',
  'USAGE_TYPE_CLASS.IMAGES',
  'USAGE_TYPE_CLASS.SNAPSHOT',
  'USAGE_TYPE_CLASS.OTHER',
];
export const usageTypeClass = [
  [],
  [1, 2, 15, 16, 17],
  [6, 21, 22, 23, 24],
  [3, 4, 5, 13],
  [7, 8],
  [9, 25],
  [10, 11, 12, 14],
];

export interface UsageRecord extends BaseModel {
  id: string;
  description: string;
  account: string;
  domainid: string;
  domain: string;
  usageid: string;
  usagetype: string;
  rawusage: string;
  zoneid: string;
  usageHour: number;
  usageTypeName: string;
}
