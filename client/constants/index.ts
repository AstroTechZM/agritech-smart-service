/**
 * Single Source of Truth for Application Constants
 */

export const APP_CONFIG = {
  NAME: 'AgriTech Smart Service',
  VERSION: '1.0.0-prototype',
  ASSIGNED_DEPOT: 'Choma Central Depot',
  ORGANIZATION: 'FRA ZAMBIA',
  CURRENCY: 'ZMW',
  COUNTRY_CODE: '260',
};

export const UI_CONSTANTS = {
  DEFAULT_AVATAR: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  PLACEHOLDER_NRC: '000000/00/1',
  ANIMATION_DURATION: 500,
  TOAST_DURATION: 3000,
};

export const LOGIC_CONSTANTS = {
  API_DELAY_SHORT: 800,
  API_DELAY_MEDIUM: 1200,
  API_DELAY_LONG: 2000,
  SYNC_TIMEOUT: 2000,
  INITIAL_WALLET_BALANCE: 4850.00,
  TX_ID_MIN: 1000,
  TX_ID_MAX: 9000,
  FRA_BUYING_PRICE: 280.00,
  FRA_PRICE_TREND: '▲ 5%',
  FRA_UNIT: '50kg bag',
  FRA_CROP: 'White Maize',
};

export const MOCK_DEFAULTS = {
  FARMER_NAME: 'Henry Mate',
  FARMER_NRC: '852016/10/1',
  CROP_MAIZE: 'White Maize',
  CROP_SOYBEANS: 'Soybeans',
  RECEIPT_PREFIX: 'PRN-TEMP',
};

