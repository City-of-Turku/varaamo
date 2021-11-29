import themeConstants from '@city-assets/constants';


const constants = {
  API_URL: SETTINGS.API_URL,
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
    DEFAULT_TILES: 'https://maptiles.turku.fi/styles/hel-osm-bright/{z}/{x}/{y}.png',
    HIGH_CONTRAST_TILES: 'https://maptiles.turku.fi/styles/hel-osm-high-contrast/{z}/{x}/{y}.png'
  },
  NAV_ADMIN_URLS: {
    gitbook: 'https://digipoint-turku.gitbook.io/varaamo-turku/',
    gitbook_sv: 'https://digipoint-turku.gitbook.io/varaamo-turku/v/v.1.0.0-swedish/',
    respa: SETTINGS.ADMIN_URL,
  },
  NOTIFICATION_DEFAULTS: {
    message: '',
    type: 'info',
    timeOut: 5000,
    hidden: false,
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
      labelTextId: 'common.paymentInProgress',
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
  SHOW_TEST_SITE_MESSAGE: SETTINGS.SHOW_TEST_SITE_MESSAGE,
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
  TRACKING: SETTINGS.TRACKING,
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
  }
};

// These values might be city specific so they can be overridden if a theme is installed
constants.FEEDBACK_URL = { ...constants.FEEDBACK_URL, ...themeConstants.FEEDBACK_URL };
constants.NAV_ADMIN_URLS = { ...constants.NAV_ADMIN_URLS, ...themeConstants.NAV_ADMIN_URLS };
constants.MAP_TILE_URLS = { ...constants.MAP_TILE_URLS, ...themeConstants.MAP_TILE_URLS };

export default constants;
