import { UserRole } from '../shared/types';

export { UserRole };
export type {
  Admin,
  Agent,
  AgronomyInsight,
  AgroDealer,
  AgroDealerStock,
  AnalyticsReport,
  Depot,
  DepotStock,
  Dispatch,
  Farm,
  Farmer,
  FarmerDeliverRecord,
  FarmProduction,
  Payment,
  Transaction,
  Voucher,
  Wallet,
} from '../shared/types';

export interface User {
  id: string;
  user_id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  cell_num?: number;
  nrc?: string;
  nrc_number?: number;
  role: UserRole;
  avatar: string;
  district?: string;

  /**
   * Optional Farmer Registration Authority ID.
   *
   * Example:
   * FRA/LUS/2026/1001
   *
   * This is generated during public farmer registration and is different
   * from the user's database id or NRC number.
   */
  farmerID?: string;
}
