import themeConstants from '@city-assets/constants';

// Read from window.__SETTINGS__ (server-injected) or SETTINGS (DefinePlugin).
// Coerce so env vars work regardless of string/boolean from vars (e.g. "false" must be falsy).
function getSetting(key) {
  // eslint-disable-next-line no-underscore-dangle
  const fromWindow = typeof window !== 'undefined' && window.__SETTINGS__ && window.__SETTINGS__[key];
  if (fromWindow !== undefined && fromWindow !== null) return fromWindow;
  const fromPlugin = typeof SETTINGS !== 'undefined' && SETTINGS && SETTINGS[key];
  return fromPlugin !== undefined && fromPlugin !== null ? fromPlugin : undefined;
}

function safeString(key, fallback = '') {
  const v = getSetting(key);
  if (typeof v === 'string') return v;
  if (v != null) return String(v);
  return fallback;
}

// Only true, '1', 'true' are truthy; string "false" / "0" / empty are falsy.
function safeBoolean(key) {
  const v = getSetting(key);
  return v === true || v === '1' || v === 'true';
}

// Already array, or JSON string, or single string -> [string].
// Empty/undefined -> [].
function safeMunicipalityOptions() {
  const v = getSetting('CUSTOM_MUNICIPALITY_OPTIONS');
  if (Array.isArray(v)) return v.length ? v : [];
  if (typeof v === 'string' && v.trim()) {
    try {
      const p = JSON.parse(v);
      return Array.isArray(p) ? p : [];
    } catch (_) {
      return [];
    }
  }
  return [];
}

const constants = {
  API_URL: safeString('API_URL'),
  CUSTOMIZATIONS: {
    'varaamo.espoo.fi': 'ESPOO',
    'varaamotest-espoo.hel.ninja': 'ESPOO',
    'varaamo.vantaa.fi': 'VANTAA',
    'varaamotest-vantaa.hel.ninja': 'VANTAA',
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_LOCALE: 'fi',
  FEEDBACK_URL: {
    FI: 'https://opaskartta.turku.fi/eFeedback/fi/Feedback/30-S%C3%A4hk%C3%B6iset%20asiointipalvelut',
    SV: 'https://opaskartta.turku.fi/eFeedback/sv/Feedback/30-S%C3%A4hk%C3%B6iset%20asiointipalvelut',
    EN: 'https://opaskartta.turku.fi/eFeedback/en/Feedback/30-S%C3%A4hk%C3%B6iset%20asiointipalvelut',
  },
  FILTER: {
    timeFormat: 'HH:mm',
    timePeriod: 30,
    timePeriodType: 'minutes',
  },
  MANAGE_RESERVATIONS: {
    PAGE_SIZE: 10,
    MAX_SHOWN_PAGINATION_BUTTONS: 9,
  },
  MAP_TILE_URLS: {
    DEFAULT_TILES: 'https://maptiles.turku.fi/styles/hel-osm-bright/{z}/{x}/{y}',
    HIGH_CONTRAST_TILES: 'https://maptiles.turku.fi/styles/high-contrast-map-layer/{z}/{x}/{y}'
  },
  NAV_ADMIN_URLS: {
    gitbook: 'https://city-of-turku.gitbook.io/varaamo-turku/',
    gitbook_sv: 'https://city-of-turku.gitbook.io/varaamo-turku/v/v.1.0.0-swedish/',
    respa: safeString('ADMIN_URL'),
  },
  NOTIFICATION_DEFAULTS: {
    message: '',
    type: 'info',
    timeOut: 5000,
    hidden: false,
  },
  PAYMENT_METHODS: {
    CASH: 'cash',
    ONLINE: 'online',
  },
  PRODUCT_TYPES: {
    MANDATORY: 'mandatory',
    EXTRA: 'extra',
  },
  RECURRING_RESERVATIONS: {
    maxRecurringReservations: 99,
  },
  REGEX: {
    namedLink: /(\[[^[\]]*?\]\(.*?(?!\[\]\(\))*?\))/gm
  },
  REQUIRED_API_HEADERS: {
    Accept: 'application/json',
    'Accept-Language': 'fi',
    'Content-Type': 'application/json',
  },
  REQUIRED_STAFF_EVENT_FIELDS: ['eventDescription', 'reserverName'],
  RESERVATION_BILLING_FIELDS: [
    'billing_first_name', 'billing_last_name', 'billing_phone_number',
    'billing_email_address', 'billing_address_street', 'billing_address_zip',
    'billing_address_city'
  ],
  RESERVATION_SHOWONLY_FILTERS: {
    FAVORITE: 'favorite',
    CAN_MODIFY: 'can_modify',
  },
  RESERVATION_STATE: {
    CONFIRMED: 'confirmed',
    REQUESTED: 'requested',
    CANCELLED: 'cancelled',
    DENIED: 'denied',
    READY_FOR_PAYMENT: 'ready_for_payment',
    WAITING_FOR_PAYMENT: 'waiting_for_payment',
    WAITING_FOR_CASH_PAYMENT: 'waiting_for_cash_payment',
  },
  RESERVATION_STATE_LABELS: {
    cancelled: {
      labelBsStyle: 'default',
      labelTextId: 'common.cancelled',
    },
    confirmed: {
      labelBsStyle: 'success',
      labelTextId: 'common.confirmed',
    },
    denied: {
      labelBsStyle: 'danger',
      labelTextId: 'common.denied',
    },
    ready_for_payment: {
      labelBsStyle: 'primary',
      labelTextId: 'common.waitingForPayment',
    },
    requested: {
      labelBsStyle: 'primary',
      labelTextId: 'common.requested',
    },
    waiting_for_payment: {
      labelBsStyle: 'danger',
      labelTextId: 'common.paymentAborted',
    },
    waiting_for_cash_payment: {
      labelBsStyle: 'primary',
      labelTextId: 'common.waitingForCashPayment',
    },
  },
  RESOURCE_PRICE_TYPES: {
    HOURLY: 'hourly',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    FIXED: 'fixed',
  },
  SEARCH_PAGE_SIZE: 30,
  DEFAULT_MUNICIPALITY_OPTIONS: ['Helsinki', 'Espoo', 'Vantaa'],
  SHOW_TEST_SITE_MESSAGE: safeBoolean('SHOW_TEST_SITE_MESSAGE'),
  SUPPORTED_LANGUAGES: ['en', 'fi', 'sv'],
  SUPPORTED_SEARCH_FILTERS: {
    freeOfCharge: '',
    date: '',
    distance: '',
    duration: 0,
    municipality: [],
    end: '',
    lat: '',
    lon: '',
    orderBy: '',
    page: 1,
    people: '',
    purpose: '',
    search: '',
    start: '',
    unit: '',
    useTimeRange: false,
  },
  TIME_FORMAT: 'H:mm',
  TIME_SLOT_DEFAULT_LENGTH: 30,
  TRACKING: safeBoolean('TRACKING'),
  TRACKING_ID: safeString('TRACKING_ID', '3'),
  SORT_BY_OPTIONS: {
    NAME: 'resource_name_lang',
    TYPE: 'type_name_lang',
    PREMISES: 'unit_name_lang',
    PEOPLE: 'people_capacity',
    // TODO: sortby 'open now' should be implemented later after API support it
  },
  FONT_SIZES: {
    SMALL: '__font-size-small',
    MEDIUM: '__font-size-medium',
    LARGE: '__font-size-large',
  },
  RESERVATION_TYPE: {
    LEGEND_TEXT_ID: 'ReservationType.legend',
    LEGEND_HINT_TEXT_ID: 'ReservationType.legendHint',
    TYPE_NAME: 'type',
    NORMAL_VALUE: 'normal',
    NORMAL_LABEL_ID: 'ReservationType.normal',
    NORMAL_HINT_TEXT_ID: 'ReservationType.normalHint',
    BLOCKED_VALUE: 'blocked',
    BLOCKED_LABEL_ID: 'ReservationType.blocked',
    BLOCKED_HINT_TEXT_ID: 'ReservationType.blockedHint',
  }
};

// Getter so CUSTOM_MUNICIPALITY_OPTIONS is read at access time (supports tests that set SETTINGS).
Object.defineProperty(constants, 'CUSTOM_MUNICIPALITY_OPTIONS', {
  get: safeMunicipalityOptions,
  enumerable: true,
});

// These values might be city specific so they can be overridden if a theme is installed
constants.FEEDBACK_URL = { ...constants.FEEDBACK_URL, ...themeConstants.FEEDBACK_URL };
constants.NAV_ADMIN_URLS = { ...constants.NAV_ADMIN_URLS, ...themeConstants.NAV_ADMIN_URLS };
constants.MAP_TILE_URLS = { ...constants.MAP_TILE_URLS, ...themeConstants.MAP_TILE_URLS };

export default constants;
