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
  'USAGE_TYPE.CPU_SPEED',
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

export interface Usage extends BaseModel {
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
