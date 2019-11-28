import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/sv';
import 'moment-timezone/builds/moment-timezone-with-data-10-year-range';

import constants from 'constants/AppConstants';

import moment from 'moment';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import se from 'react-intl/locale-data/se';

import { loadPersistedLocale } from 'store/middleware/persistState';
import enMessages from 'i18n/messages/en.json';
import fiMessages from 'i18n/messages/fi.json';
import svMessages from 'i18n/messages/sv.json';


const messages = {
  en: enMessages,
  fi: fiMessages,
  se: svMessages,
};

moment.defineLocale('varaamo-en', {
  parentLocale: 'en-gb',
});

moment.defineLocale('varaamo-fi', {
  parentLocale: 'fi',
  longDateFormat: {
    LT: 'H:mm',
    LLL: 'Do MMMM[ta] [klo] LT',
  },
});

moment.defineLocale('varaamo-se', {
  parentLocale: 'sv',
  longDateFormat: {
    L: 'DD.MM.YYYY',
  },
});

addLocaleData([...en, ...fi, ...se]);

function initI18n() {
  const persistedData = loadPersistedLocale();

  /*
    if language is not in persistedDate
      - try to use navigator.language or navigator.userLanguage
      - use default locale as a fallback
  */

  const browserLanguage = (navigator.language || navigator.userLanguage).toLowerCase();
  let locale;

  if (persistedData) {
    locale = persistedData;
  } else if (browserLanguage === 'sv' || browserLanguage === 'sv-fi' || browserLanguage === 'sv-se') {
    locale = 'se';
  } else if (browserLanguage.includes('en')) {
    locale = 'en';
  } else if (browserLanguage === 'fi') {
    locale = browserLanguage;
  } else {
    locale = constants.DEFAULT_LOCALE;
  }

  moment.locale(`varaamo-${locale}`);
  const initialIntlState = {
    intl: {
      defaultLocale: constants.DEFAULT_LOCALE,
      locale,
      messages: messages[locale],
    },
  };
  return initialIntlState;
}

export default initI18n;
